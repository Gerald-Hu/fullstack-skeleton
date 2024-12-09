import { Router, Mutation, Query, Input, Ctx } from 'nestjs-trpc';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from '@/app.context';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = loginSchema.extend({
  name: z.string().optional(),
});

@Injectable()
@Router({alias:'auth'})
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: loginSchema
  })
  async login(
    @Input() input: z.infer<typeof loginSchema>,
    @Ctx() ctx: { res: Response }
  ) {
    const user = await this.authService.validateUser(input.email, input.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return this.authService.login(user, ctx.res);
  }

  @Mutation({
    input: signupSchema
  })
  async signup(
    @Input() input: z.infer<typeof signupSchema>,
    @Ctx() ctx: { res: Response }
  ) {

    return this.authService.signup(
      input.email,
      input.password,
      input.name || '',
      ctx.res
    );
  }

  @Mutation()
  async logout(
    @Ctx() { req, res }: { req: { cookies: { refreshToken: string } }, res: Response }
  ) {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService.logout(refreshToken, res);
  }

  @Mutation()
  async refresh(@Ctx() ctx: { req: { cookies: { refreshToken: string } }, res: Response }) {
    const refreshToken = ctx.req.cookies.refreshToken;
  
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    try {
      return await this.authService.refresh(refreshToken, ctx.res);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  @Query()
  async me(@Ctx() ctx: { auth: { user?: User } | null }) {

    if (!ctx.auth?.user) {
      return null;
    }
    return {
      id: ctx.auth.user.id,
      email: ctx.auth.user.email,
      name: ctx.auth.user.name,
    };
  }
}
