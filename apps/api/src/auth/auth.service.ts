import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { Response } from "express";
import { db } from "../drizzle/client";
import { refreshTokens, users } from "../drizzle/schema";
import { OAuth2Client } from "google-auth-library";
import { eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const GOOGLE_CLIENT_ID = "78084335849-pkin15ect4lf90evbasf48q93jgqo9at.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const loginResult = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
  }),
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: "15m", // Short-lived access token
    });
  }

  private generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: "7d", // 7 days
    });
  }

  private async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = { email: user.email, sub: user.id };

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    // Set cookies (keeping for backward compatibility)
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return tokens along with user data for mobile app
    // Ignore tokens in web, web is using httponly cookies
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async loginWithGoogle(credential: string) {
    try {
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Google credentials",
        });
      }

      // Check if user exists
      let user = await db.query.users.findFirst({
        where: or(
          eq(users.email, payload.email),
          eq(users.googleId, payload.sub)
        ),
      });

      if (!user) {
        // Create new user if doesn't exist
        user = await db
          .insert(users)
          .values({
            email: payload.email,
            name: payload.name || payload.email.split("@")[0],
            googleId: payload.sub,
            emailVerified: payload.email_verified || false,
            image: payload.picture || null,
          })
          .returning()
          .then((res) => res[0]);
      } else if (!user.googleId) {
        // Link Google account to existing email account
        user = await db
          .update(users)
          .set({
            googleId: payload.sub,
            emailVerified: payload.email_verified || user.emailVerified,
            image: payload.picture || user.image,
          })
          .where(eq(users.id, user.id))
          .returning()
          .then((res) => res[0]);
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      if (user == null){
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to authenticate with Google",
        });
      }

      // Store refresh token
      await db.insert(refreshTokens).values({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return {
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.error("Google login error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to authenticate with Google",
      });
    }
  }

  async refresh(refreshToken: string, response: Response) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Check if token exists in database
      const [storedToken] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken));

      if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Refresh token expired",
        });
      }

      // Get the user
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      // Delete the used refresh token immediately after verification
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken));

      // Generate new tokens
      const newPayload = { email: user.email, sub: user.id };
      const accessToken = this.generateAccessToken(newPayload);
      const newRefreshToken = this.generateRefreshToken(newPayload);

      // Store new refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await db.insert(refreshTokens).values({
        token: newRefreshToken,
        userId: user.id,
        expiresAt,
      });

      // Set new cookies
      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      response.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Refresh tokens, along with user data
      // Ignore tokens in web, web is using httponly cookies

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        tokens: {
          accessToken: accessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error: unknown) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
      });
    }
  }

  async signup(
    email: string,
    password: string,
    name: string,
    response: Response
  ) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException("Email already exists");
    }

    const user = await this.usersService.create(email, password, name);
    const { password: _, ...result } = user;

    return this.login(result, response);
  }

  async logout(refreshToken: string | undefined, response: Response) {
    try {
      // If refresh token exists, delete it from database
      if (refreshToken) {
        await db
          .delete(refreshTokens)
          .where(eq(refreshTokens.token, refreshToken));
      }

      // Clear cookies regardless of token status
      response.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      response.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return { message: "Logged out successfully" };
    } catch (error) {
      // Even if token deletion fails, we still want to clear cookies
      response.clearCookie("accessToken");
      response.clearCookie("refreshToken");
      throw error;
    }
  }

  me(ctx: { id: string; email: string; name?: string }) {
    return {
      id: ctx.id,
      email: ctx.email,
      name: ctx.name,
    };
  }
}
