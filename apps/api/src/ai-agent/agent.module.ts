import { Module } from "@nestjs/common";
import { GoalsModule } from "@/goals/goals.module";
import { TaskModule } from "@/task/task.module";

@Module({
  imports: [GoalsModule, TaskModule],
  providers: [],
  exports: []
})
export class AgentModule {}