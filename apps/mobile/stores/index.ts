import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./auth/useAuthSlice";
import { createOnboardingSlice, OnboardingSlice } from "./onboarding/useOnboardingSlice";

// Define the shape of our entire store
type StoreState = AuthSlice & OnboardingSlice;

// Create the store without persistence for auth state
export const useStore = create<StoreState>((...args) => ({
  ...createAuthSlice(...args),
  ...createOnboardingSlice(...args),
}));