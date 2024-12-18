import { StateCreator } from "zustand";
import { trpc } from "@/utils/trpc";
import { Task } from "@/trpc-services/task";
import { container } from "tsyringe";
import { TaskService } from "@/trpc-services/task";

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  tasksMap: Map<string, Task[]>;
}

export interface TaskActions {
  fetchTasks: () => Promise<void>;
  createTask: (content: string, status: Task["status"]) => Promise<void>;
  updateTask: (
    taskId: string,
    data: Partial<Pick<Task, "content" | "status" | "duration">>
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export type TaskSlice = TaskState & TaskActions;

export const createTaskSlice: StateCreator<TaskSlice> = (set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // <date, Task[]>
  tasksMap: new Map(),

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });

      const tasks = await container.resolve(TaskService).getTasks();

      set({ tasks, isLoading: false });

      const tasksMap = new Map<string, Task[]>();
      tasks.forEach((task) => {
        const date = new Date(task.createdAt).toISOString().split("T")[0]; // Get YYYY-MM-DD
        const existingTasks = tasksMap.get(date) || [];
        tasksMap.set(date, [...existingTasks, task]);
      });

      set({ tasksMap });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  createTask: async (content: string, status: Task["status"]) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await container.resolve(TaskService).createTask({content, duration: "35min"});
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create task",
        isLoading: false,
      });
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await container.resolve(TaskService).deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete task",
        isLoading: false,
      });
    }
  },

  updateTask: async (
    taskId: string,
    data: Partial<Pick<Task, "content" | "status" | "duration">>
  ) => {
    try {
      set({ isLoading: true, error: null });
      const result = await trpc.task.updateTask.mutate({ taskId, content: {...data} });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update task",
        isLoading: false,
      });
    }
  },


});
