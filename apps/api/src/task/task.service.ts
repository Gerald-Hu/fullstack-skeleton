import { Injectable } from '@nestjs/common';
import { db } from '../drizzle/client';
import { tasks, Task } from '../drizzle/schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

export const newTaskSchema = z.object({
  content: z.string(),
  duration: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  goal: z.string().uuid().optional()
});

@Injectable()
export class TaskService {

  async getTasks(userId: string) {
    try {
      const userTasks: Task[] = await db.select()
        .from(tasks)
        .where(eq(tasks.userId, userId))
        .orderBy(tasks.createdAt);
      
      return userTasks;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch tasks',
        cause: error,
      });
    }
  }

  async createTask(userId: string, data: z.infer<typeof newTaskSchema>) {
    try {
      const [newTask] = await db.insert(tasks).values({
        userId,
        content: data.content,
        status: "pending",
        duration: data.duration,
        goalId: data.goal
      }).returning();
      
      return newTask;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create task',
        cause: error,
      });
    }
  }

  async updateTask(userId: string, taskId: string, data: Partial<z.infer<typeof newTaskSchema>>) {
    try {
      const [updatedTask] = await db.update(tasks)
        .set({
          ...data,
          updatedAt: new Date(),
          completedAt: data.status === 'completed' ? new Date() : null
        })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .returning();

      if (!updatedTask) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }
      return updatedTask;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update task',
        cause: error,
      });
    }
  }

  async deleteTask(userId: string, taskId: string) {
    try {
      const [deletedTask] = await db.delete(tasks)
        .where(and(
          eq(tasks.id, taskId),
          eq(tasks.userId, userId)
        ))
        .returning();

      if (!deletedTask) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      return deletedTask;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete task',
        cause: error,
      });
    }
  }

}