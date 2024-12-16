import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  hi: t.router({ sayHi: publicProcedure.query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any) }),
  auth: t.router({
    login: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })).output(z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string().optional(),
      }),
      tokens: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    loginWithGoogle: publicProcedure.input(z.object({
      credential: z.string(),
    })).output(z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string().optional(),
      }),
      tokens: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    signup: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }).extend({
      name: z.string().optional(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    logout: publicProcedure.mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    refresh: publicProcedure.mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    me: publicProcedure.output(z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

