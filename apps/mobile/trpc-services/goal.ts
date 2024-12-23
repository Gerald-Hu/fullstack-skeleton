import "@service/reflect";
import { injectable, singleton } from "tsyringe";
import { withTokenRefresh } from "@utils/trpc";
import { trpc } from "@utils/trpc";

export interface Goal {
  id: string;
  content: string;
  durationDays: number;
  createdAt: string;
  completedAt: string | null;
  userId: string;
}

@injectable()
@singleton()
export class GoalService {

  @withTokenRefresh()
  async getGoals() {
    return await trpc.goals.getGoals.query() as Goal[];
  }

  @withTokenRefresh()
  async createGoal(content: string, durationDays: number) {
    return await trpc.goals.createGoal.mutate({
      content,
      durationDays,
    }) as Goal;
  }

  @withTokenRefresh()
  async deleteGoal(goalId: string) {
    return await trpc.goals.deleteGoal.mutate({ goalId }) as Goal;
  }

  @withTokenRefresh()
  async updateGoal(goalId: string, data: Partial<Pick<Goal, "content" | "durationDays">>) {
    return await trpc.goals.updateGoal.mutate({ id: goalId, ...data }) as Goal;
  }

}