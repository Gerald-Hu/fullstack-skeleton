import { Injectable } from "@nestjs/common";
import { GoalsService, newGoalSchema, goalSchema } from "./goals.service";
import { type NewGoal } from "../drizzle/schema";
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
  async createGoal(@Input() newGoal: z.infer<typeof newGoalSchema>, @Ctx() ctx: Context) {
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
  async deleteGoal(
    @Input() input: { goalId: string },
    @Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return this.goalsService.remove(ctx.auth.user.id, input.goalId);
  }

  @Mutation()
  async updateGoal(@Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  @Mutation()
  async completeGoal(@Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  @Mutation()
  async suggestTasks(@Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  }
}
