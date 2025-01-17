import { Injectable } from "@nestjs/common";
import { GoalsService, newGoalSchema, goalSchema } from "./goals.service";
import { Router, Mutation, Query, Input, Ctx } from "nestjs-trpc";
import type { Context } from "@/app.context";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
