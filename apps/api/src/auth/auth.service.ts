import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { db } from '../drizzle/client';
import { refreshTokens } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: '15m', // Short-lived access token
    });
  }

  private generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d', // 7 days
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(user, password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = { email: user.email, sub: user.id };
    
    // Generate tokens
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    // Set cookies
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
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
          code: 'UNAUTHORIZED',
          message: 'Refresh token expired',
        });
      }

      // Get the user
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
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
      response.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error: unknown) {
      if (
        error && 
        typeof error === 'object' && 
        'name' in error && 
        typeof error.name === 'string' && 
        (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')
      ) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  async signup(email: string, password: string, name: string, response: Response) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
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
      response.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      return { message: 'Logged out successfully' };
    } catch (error) {
      // Even if token deletion fails, we still want to clear cookies
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');
      throw error;
    }
  }
}
