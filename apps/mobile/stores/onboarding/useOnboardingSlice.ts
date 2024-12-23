import AsyncStorage from "@react-native-async-storage/async-storage";
import { SliceCreator } from "..";

const ONBOARDING_KEY = "@onboarding_complete";

export interface OnboardingState {
  hasCompletedOnboarding: boolean;
}

export interface OnboardingActions {
  completeOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export type OnboardingSlice = OnboardingState & OnboardingActions;

export const createOnboardingSlice: SliceCreator<OnboardingSlice> = (set) => ({
  // Initial state
  hasCompletedOnboarding: false,

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set((state) => ({
      onboarding: { ...state.onboarding, hasCompletedOnboarding: true },
    }));
  },

  checkOnboardingStatus: async () => {
    const status = await AsyncStorage.getItem(ONBOARDING_KEY);
    set((state) => ({
      onboarding: { ...state.onboarding, hasCompletedOnboarding: status === "true" },
    }));
  },

  resetOnboarding: async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    set((state) => ({
      onboarding: { ...state.onboarding, hasCompletedOnboarding: false },
    }));
  },
});
