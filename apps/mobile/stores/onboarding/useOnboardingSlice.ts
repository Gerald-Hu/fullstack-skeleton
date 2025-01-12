import { SliceCreator } from "@/stores";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isOnboardingVisible: boolean;
}

export interface OnboardingActions {
  checkOnboardingStatus: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  showOnboarding: () => void;
  hideOnboarding: () => void;
}

export type OnboardingSlice = OnboardingState & OnboardingActions;

const ONBOARDING_KEY = "@onboarding_completed";

export const createOnboardingSlice: SliceCreator<OnboardingSlice> = (
  set,
  get
) => ({
  hasCompletedOnboarding: false,
  isOnboardingVisible: false,

  checkOnboardingStatus: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      set((state) => ({
        onboarding: {
          ...state.onboarding,
          hasCompletedOnboarding: value === "true",
        },
      }));
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      set((state) => ({
        onboarding: {
          ...state.onboarding,
          hasCompletedOnboarding: true,
        },
      }));
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  },

  resetOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "false");
      set((state) => ({
        onboarding: {
          ...state.onboarding,
          hasCompletedOnboarding: false,
          isOnboardingVisible: false,
        },
      }));
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  },

  showOnboarding: () => {
    console.log("showing onboarding");
    console.log(get().onboarding.isOnboardingVisible);
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        isOnboardingVisible: true,
      },
    }));
  },

  hideOnboarding: () => {
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        isOnboardingVisible: false,
      },
    }));
  },
});
