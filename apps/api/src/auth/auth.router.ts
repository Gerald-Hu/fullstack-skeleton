import { Router, Mutation, Query, Input, Ctx } from "nestjs-trpc";
import { z } from "zod";
import { AuthService } from "./auth.service";
import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { User } from "@/app.context";
import { TRPCError } from "@trpc/server";
import type { Context } from "@/app.context";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = loginSchema.extend({
  name: z.string().optional(),
});


@Injectable()
@Router({ alias: "auth" })
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: loginSchema,
  })
  async login(
    @Input() input: z.infer<typeof loginSchema>,
    @Ctx() ctx: { res: Response }
  ) {
    const user = await this.authService.validateUser(
      input.email,
      input.password
    );
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }

    return this.authService.login(user, ctx.res);
  }

  @Mutation({
    input: signupSchema,
  })
  async signup(
    @Input() input: z.infer<typeof signupSchema>,
    @Ctx() ctx: { res: Response }
  ) {
    try {
      return await this.authService.signup(
        input.email,
        input.password,
        input.name || "",
        ctx.res
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during signup",
      });
    }
  }

  @Mutation()
  async logout(
    @Ctx()
    { req, res, bearerToken }: { req: { cookies: { refreshToken: string }, headers: { authorization: string } }; res: Response, bearerToken: string }
  ) {
    const refreshTokenFromCookie = req.cookies["refreshToken"];
    const refreshTokenFromHeader = bearerToken;

    const refreshToken = refreshTokenFromCookie || refreshTokenFromHeader;

    try {
      return await this.authService.logout(refreshToken, res);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to logout",
      });
    }
  }

  @Mutation()
  async refresh(
    @Ctx() ctx: Context
  ) {
    const refreshToken = ctx.req.cookies.refreshToken ?? ctx.bearerToken;

    if (!refreshToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Refresh token not found",
      });
    }

    try {
      return await this.authService.refresh(refreshToken, ctx.res);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          error instanceof Error ? error.message : "Failed to refresh token",
      });
    }
  }

  @Query(
    {output: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().optional(),
    })}
  )
  async me(
    @Ctx() ctx: { auth: { user?: User } | null }
  ) {
    if (!ctx.auth?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }
    return {
      id: ctx.auth.user.id,
      email: ctx.auth.user.email,
      name: ctx.auth.user.name,
    };
  }
}
