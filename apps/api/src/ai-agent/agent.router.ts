import { Injectable } from "@nestjs/common";
import { Router, Mutation, Query, Input, Ctx } from "nestjs-trpc";
import { AgentService } from "./agent.service";
import { TRPCError } from "@trpc/server";
import { Context } from "@/app.context";
import { z } from "zod";

@Injectable()
@Router({ alias: "agent" })
export class AgentRouter {
  constructor(
    private agentService: AgentService,
  ) {}

  @Mutation({
    input: z.object({
      input: z.string(),
    }),
    output: z.string(),
  })
  async suggestTasks(@Input() input: { input: string }, @Ctx() ctx: Context) {
    if (!ctx.auth.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return this.agentService.create(ctx.auth.user.id, input.input);
  }
}
