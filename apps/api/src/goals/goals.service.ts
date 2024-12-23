import { Injectable } from "@nestjs/common";
import { goals, type Goal, type NewGoal } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const newGoalSchema = z.object({
  content: z.string(),
  durationDays: z.number(),
});

export const goalSchema = z.object({
  id: z.string(),
  content: z.string(),
  durationDays: z.number(),
  createdAt: z.date(),
  completedAt: z.date().nullable(),
  userId: z.string(),
});

@Injectable()
export class GoalsService {
  async create(
    userId: string,
    newGoal: z.infer<typeof newGoalSchema>
  ): Promise<Goal> {
    const goalToCreate: NewGoal = {
      userId,
      ...newGoal,
    };
    try {
      const [goal] = await db.insert(goals).values(goalToCreate).returning();
      return goal;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create goal",
        cause: error,
      });
    }
  }

  async findAll(userId: string): Promise<Goal[]> {
    try {
      return db.select().from(goals).where(eq(goals.userId, userId));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch goals",
        cause: error,
      });
    }
  }

  async findOne(id: string): Promise<Goal | null> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal || null;
  }

  async remove(userId: string, id: string): Promise<Goal | null> {
    try {
      const [goal] = await db
        .delete(goals)
        .where(and(eq(goals.id, id), eq(goals.userId, userId)))
        .returning();
      return goal || null;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete goal",
        cause: error,
      });
    }
  }

  async update(
    userId: string,
    updatedGoal: { id: string; content?: string; durationDays?: number }
  ): Promise<Goal | null> {
    try {
      const [goal] = await db
        .update(goals)
        .set(updatedGoal)
        .where(and(eq(goals.id, updatedGoal.id), eq(goals.userId, userId)))
        .returning();
      return goal || null;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update goal",
        cause: error,
      });
    }
  }

  async complete(userId: string, id: string): Promise<Goal | null> {
    try{
    const [goal] = await db
      .update(goals)
      .set({ completedAt: new Date() })
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
    return goal || null;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to complete goal",
        cause: error,
      });
    }
  }
}
