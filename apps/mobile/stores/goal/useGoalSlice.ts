import AsyncStorage from "@react-native-async-storage/async-storage";
import { SliceCreator } from "@/stores";
import { Goal, GoalService } from "@/trpc-services/goal";
import { container } from "tsyringe";
import { TRPCClientError } from "@trpc/client";

export interface GoalState {
  goals: Goal[];
}

export interface GoalActions {
  fetchGoals: () => Promise<void>;
  createGoal: (title: string, duration: number) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateGoal: (goalId: string, data: Partial<Pick<Goal, "content" | "durationDays">>) => Promise<void>;
  suggestTask: (goalId: string) => Promise<string | undefined>;
}

export type GoalSlice = GoalState & GoalActions;

export const createGoalSlice: SliceCreator<GoalSlice> = (set, get) => ({
  // Initial state
  goals: [],

  // Actions

  fetchGoals: async () => {
    try {
      const goals = await container.resolve(GoalService).getGoals();
      set((state) => ({
        goal: {
          ...state.goal,
          goals,
        },
      }));

    } catch (error) {
      console.error("Goal fetch error:", error);
    }
  },

  createGoal: async (title: string, duration: number) => {
    try {
      const goal = await container.resolve(GoalService).createGoal(title, duration);
      set((state) => ({
        goal: {
          ...state.goal,
          goals: [...state.goal.goals, goal],
        },
      }));
    } catch (error) {
      console.error("Goal creation error:", error);
    }
  },

  deleteGoal: async (goalId: string) => {
    try {
      void await container.resolve(GoalService).deleteGoal(goalId);
      set((state) => ({
        goal: {
          ...state.goal,
          goals: state.goal.goals.filter((goal) => goal.id !== goalId),
        },
      }));
    } catch (error) {
      console.error("Goal deletion error:", error);
    }
  },

  updateGoal: async (goalId: string, data: Partial<Pick<Goal, "content" | "durationDays">>) => {
    try {
      const updatedGoal = await container.resolve(GoalService).updateGoal(goalId, data);
      set((state) => ({
        goal: {
          ...state.goal,
          goals: state.goal.goals.map((goal) => (goal.id === goalId ? updatedGoal : goal)),
        },
      }));
    } catch (error) {
      console.error("Goal update error:", error);
    }
  },
  
  suggestTask: async ( goalId: string) => {
    try {
      const goal = get().goal.goals.find((goal) => goal.id === goalId);

      if (goal == null) {
        throw new TRPCClientError("Goal not found");
      }

      const result = await container.resolve(GoalService).suggestTasks(`For this goal: ${goal.content} with id: ${goal.id}, add a task`);
      console.log("successful ai agent call", result);
      return result;
    } catch (error) {
      console.error("Goal update error:", error);
    }
  },

});
