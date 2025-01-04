import { Module } from "@nestjs/common";
import { GoalsModule } from "@/goals/goals.module";
import { TaskModule } from "@/task/task.module";
import { AgentService } from "./agent.service";
import { AgentRouter } from "./agent.router";

@Module({
  imports: [GoalsModule, TaskModule],
  providers: [AgentService, AgentRouter],
  exports: [AgentService]
})
export class AgentModule {}