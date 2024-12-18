import "@service/reflect";
import { injectable, singleton } from "tsyringe";
import { withTokenRefresh } from "@utils/trpc";
import { trpc } from "@utils/trpc";

export interface Task {
  id: string;
  userId: string;
  content: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  duration: string;
}

export interface CreateTaskInput {
  content: string;
  duration: string;
}

@injectable()
@singleton()
export class TaskService {

  @withTokenRefresh()
  async getTasks(): Promise<Task[]> {
    return await trpc.task.getTasks.query();
  }

  @withTokenRefresh()
  async createTask(input: CreateTaskInput): Promise<Task> {
    return await trpc.task.createTask.mutate(input);
  }

  @withTokenRefresh()
  async deleteTask(taskId: string) {
    return await trpc.task.deleteTask.mutate({ taskId });
  }

  // @withTokenRefresh()
  // async updateTask(taskId: string, input: Partial<CreateTaskInput>): Promise<Task> {
  //   return await trpc.task.updateTask.mutate({
  //     taskId,
  //     ...input
  //   });
  // }

}