import { Inject, Injectable } from '@nestjs/common';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { TRPCError } from '@trpc/server';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Context {
  req: Request;
  res: Response;
  auth: {
    user: User | null;
  };
  bearerToken?: string
}

@Injectable()
export class AppContext implements TRPCContext {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async create(opts: ContextOptions): Promise<Record<string, unknown>> {
    const accessTokenFromCookie = opts.req.cookies['accessToken'];
    const accessTokenFromHeaderUnextracted = opts.req.headers.authorization;
    const accessTokenFromHeader = accessTokenFromHeaderUnextracted?.split(' ')[1] === 'null' ? null : accessTokenFromHeaderUnextracted?.split(' ')[1];

    const accessToken = accessTokenFromCookie || accessTokenFromHeader;

    if (!accessToken) {
      return {
        req: opts.req,
        res: opts.res,
        auth: { user: null },
        bearerToken: null,
      };
    }

    try {
      // Verify access token
      const payload = this.jwtService.verify(accessToken);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      return {
        req: opts.req,
        res: opts.res,
        auth: {
          user: userWithoutPassword,
        },
        bearerToken: accessToken,
      };
    } catch (error: unknown) {
      if (
        error && 
        typeof error === 'object' && 
        'name' in error && 
        typeof error.name === 'string' && 
        (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')
      ) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired access token',
        });
      }
      
      // If it's already a TRPCError, rethrow it
      if (error instanceof TRPCError) {
        throw error;
      }

      // For any other error, throw a generic TRPC error
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      });
    }
  }
}