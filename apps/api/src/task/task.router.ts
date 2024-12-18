import { Router, Mutation, Query, Input, Ctx } from 'nestjs-trpc';
import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { TaskService, newTaskSchema } from './task.service';
import { TRPCError } from '@trpc/server';
import type { Context } from '@/app.context';
import { type Task } from '@/drizzle/schema';

const taskIdSchema = z.object({
  taskId: z.string().uuid(),
});

const returnedTaskSchema = z.object({
  id: z.string(),
  content: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullable(),
  userId: z.string(),
  duration: z.string(),
});

@Injectable()
@Router({ alias: 'task' })
export class TaskRouter {
  constructor(private readonly taskService: TaskService) {}

  @Query({
    output: z.array(returnedTaskSchema),
  })
  async getTasks(@Ctx() ctx: Context): Promise<Task[]> {
    if (!ctx.auth.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return this.taskService.getTasks(ctx.auth.user.id);
  }

  @Mutation({
    input: z.object({
      content: z.string(),
      duration: z.string(),
    }),
    output: returnedTaskSchema,
  })
  async createTask(
    @Input() input: z.infer<typeof newTaskSchema>,
    @Ctx() ctx: Context,
  ) {
    if (!ctx.auth.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return this.taskService.createTask(ctx.auth.user.id, input);
  }

  @Mutation({
    input: taskIdSchema,
    output: returnedTaskSchema,
  })
  async deleteTask(
    @Input() input: z.infer<typeof taskIdSchema>,
    @Ctx() ctx: Context,
  ) {
    if (!ctx.auth.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    const result = await this.taskService.deleteTask(ctx.auth.user.id, input.taskId);
    return result;
  }

  @Mutation({
    input: z.object({
      taskId: z.string(),
      content: z.object({
        content: z.string().optional(),
        duration: z.string().optional(),
        status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional()
      })
    }),
    output: returnedTaskSchema,
  })
  async updateTask(
    @Input('content') content: z.infer<typeof newTaskSchema>,
    @Input('taskId') taskId: string,
    @Ctx() ctx: Context,
  ) {
    if (!ctx.auth.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return this.taskService.updateTask(ctx.auth.user.id, taskId, content);
  }

  // @Mutation({
  // })
  // async completeTask(
  //   @Input() input: z.infer<typeof taskIdSchema>,
  //   @Ctx() ctx: Context,
  // ) {
  //   if (!ctx.auth.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  //   return this.taskService.completeTask(ctx.auth.user.id, input.taskId);
  // }
}