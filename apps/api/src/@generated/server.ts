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
  }),
  task: t.router({
    getTasks: publicProcedure.output(z.array(z.object({
      id: z.string(),
      content: z.string(),
      status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
      createdAt: z.date(),
      updatedAt: z.date(),
      completedAt: z.date().nullable(),
      userId: z.string(),
      duration: z.string(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createTask: publicProcedure.input(z.object({
      content: z.string(),
      duration: z.string(),
    })).output(z.object({
      id: z.string(),
      content: z.string(),
      status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
      createdAt: z.date(),
      updatedAt: z.date(),
      completedAt: z.date().nullable(),
      userId: z.string(),
      duration: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteTask: publicProcedure.input(z.object({
      taskId: z.string().uuid(),
    })).output(z.object({
      id: z.string(),
      content: z.string(),
      status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
      createdAt: z.date(),
      updatedAt: z.date(),
      completedAt: z.date().nullable(),
      userId: z.string(),
      duration: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateTask: publicProcedure.input(z.object({
      taskId: z.string(),
      content: z.object({
        content: z.string().optional(),
        duration: z.string().optional(),
        status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional()
      })
    })).output(z.object({
      id: z.string(),
      content: z.string(),
      status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
      createdAt: z.date(),
      updatedAt: z.date(),
      completedAt: z.date().nullable(),
      userId: z.string(),
      duration: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

