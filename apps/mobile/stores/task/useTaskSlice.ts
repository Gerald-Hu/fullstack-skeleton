import { SliceCreator } from "@/stores";
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

export const createTaskSlice: SliceCreator<TaskSlice> = (set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // <date, Task[]>
  tasksMap: new Map(),

  fetchTasks: async () => {
    try {
      set((state) => ({
        task: {
          ...state.task,
          isLoading: true,
          error: null,
        },
      }));

      const tasks = await container.resolve(TaskService).getTasks();

      set((state) => ({
        task: {
          ...state.task,
          tasks,
          isLoading: false,
        },
      }));

      const tasksMap = new Map<string, Task[]>();
      tasks.forEach((task) => {
        const date = new Date(task.createdAt).toISOString().split("T")[0]; // Get YYYY-MM-DD
        const existingTasks = tasksMap.get(date) || [];
        tasksMap.set(date, [...existingTasks, task]);
      });

      set((state) => ({
        task: {
          ...state.task,
          tasksMap,
        },
      }));
    } catch (error) {
      set(state => ({
        task: {
          ...state.task,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to fetch tasks",
        },
      }));
    }
  },

  createTask: async (content: string, status: Task["status"]) => {
    try {
      set(state => ({
        task: {
          ...state.task,
          isLoading: true,
          error: null,
        },
      }));
      const newTask = await container
        .resolve(TaskService)
        .createTask({ content, duration: "35min" });

      set(state => ({
        task: {
          ...state.task,
          tasks: [...state.task.tasks, newTask],
          isLoading: false,
        },
      }));

    } catch (error) {
      set(state => ({
        task: {
          ...state.task,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to create task",
        },
      }));
      throw new Error(
        error instanceof Error ? error.message : "Failed to create task"
      );
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      set(state => ({
        task: {
          ...state.task,
          isLoading: true,
          error: null,
        },
      }));

      const result = await container.resolve(TaskService).deleteTask(taskId);
      set(state => ({
        task: {
          ...state.task,
          tasks: state.task.tasks.filter((task) => task.id !== taskId),
          isLoading: false,
        },
      }));

    } catch (error) {
      set(state => ({
        task: {
          ...state.task,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to delete task",
        },
      }));
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete task"
      );
    }
  },

  updateTask: async (
    taskId: string,
    data: Partial<Pick<Task, "content" | "status" | "duration">>
  ) => {
    try {
      set(state => ({
        task: {
          ...state.task,
          isLoading: true,
          error: null,
        },
      }));

      const result = await container.resolve(TaskService).updateTask(taskId, data);
      
    } catch (error) {
      set(state => ({
        task: {
          ...state.task,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to update task",
        },
      }));
      throw new Error(
        error instanceof Error ? error.message : "Failed to update task"
      );
    }
  },
});
