import { Injectable } from "@nestjs/common";
import { GoalsService, newGoalSchema, goalSchema } from "./goals.service";
import { type NewGoal } from "../drizzle/schema";
import { Router, Mutation, Query, Input, Ctx } from "nestjs-trpc";
import type { Context } from "@/app.context";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { goals, type Goal, tasks } from "../drizzle/schema";

@Injectable()
@Router({ alias: "goals" })
export class GoalsRouter {
  constructor(private readonly goalsService: GoalsService) {}

  @Mutation({
    input: newGoalSchema,
    output: goalSchema,
  })
  async createGoal(
    @Input() newGoal: z.infer<typeof newGoalSchema>,
    @Ctx() ctx: Context
  ) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return this.goalsService.create(ctx.auth.user.id, newGoal);
  }

  @Query({
    output: z.array(goalSchema),
  })
  async getGoals(@Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return this.goalsService.findAll(ctx.auth.user.id);
  }

  @Query({
    output: goalSchema,
  })
  async getGoal(@Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  @Mutation({
    input: z.object({
      goalId: z.string().uuid(),
    }),
    output: goalSchema,
  })
  async deleteGoal(@Input() input: { goalId: string }, @Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return this.goalsService.remove(ctx.auth.user.id, input.goalId);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      content: z.string().optional(),
      durationDays: z.number().optional(),
    }),
    output: goalSchema,
  })
  async updateGoal(
    @Input()
    updatedGoal: { id: string; content?: string; durationDays?: number },
    @Ctx() ctx: Context
  ) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return this.goalsService.update(ctx.auth.user.id, updatedGoal);
  }

  @Mutation()
  async suggestTasks(@Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    
    const model = new OpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
    });

    model.apiKey = process.env.OPENAI_API_KEY ?? "";

    const template = `Given a user's goal, suggest 3 specific, actionable tasks that will help them achieve it.
    Each task should be clear, measurable, and achievable within a reasonable timeframe.
    Format each task as a single sentence.
    Current date: {currentDate}
    
    Goal: {goalContent}
    
    Tasks:`;

    const prompt = new PromptTemplate({
      template,
      inputVariables: ["goalContent", "currentDate"],
    });

    // Get the user's active goal
    const activeGoal = await db.query.goals.findFirst({
      where: and(
        eq(goals.userId, ctx.auth.user.id)
      ),
    });

    if (!activeGoal) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active goal found",
      });
    }

    const formattedPrompt = await prompt.format({
      goalContent: activeGoal.content,
      currentDate: "2024-12-23",
    });

    const response = await model.call(formattedPrompt);
    const taskSuggestions = response.split('\n').filter(task => task.trim().length > 0).slice(0, 3);

    // Create tasks in the database
    const createdTasks = await Promise.all(
      taskSuggestions.map(async (content) => {
        return await db.insert(tasks).values({
          userId: ctx.auth.user?.id ?? "",
          goalId: activeGoal.id,
          content: content.trim(),
          status: 'pending',
        }).returning();
      })
    );

    return createdTasks;
  }

  @Mutation({
    input: z.object({
      goalId: z.string().uuid(),
    }),
    output: goalSchema
  })
  async completeGoal(@Input() input: { goalId: string }, @Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return this.goalsService.complete(ctx.auth.user.id, input.goalId);
  }
}
