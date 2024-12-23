import { create, StateCreator } from "zustand";
import { createAuthSlice, AuthSlice } from "./auth/useAuthSlice";
import { createOnboardingSlice, OnboardingSlice } from "./onboarding/useOnboardingSlice";
import { createTaskSlice, TaskSlice } from "./task/useTaskSlice";
import { createGoalSlice, GoalSlice } from "./goal/useGoalSlice";

// Define the shape of our entire store
type StoreState = { 
  auth: AuthSlice;
  onboarding: OnboardingSlice;
  task: TaskSlice;
  goal: GoalSlice;
};

export type SliceCreator<T> = StateCreator<StoreState, [], [], T>;

// Create the store without persistence for auth state
export const useStore = create<StoreState>((...args) => ({
  auth: createAuthSlice(...args),
  onboarding: createOnboardingSlice(...args),
  task: createTaskSlice(...args),
  goal: createGoalSlice(...args),
}));