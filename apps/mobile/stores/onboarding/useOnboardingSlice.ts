import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator } from 'zustand';

const ONBOARDING_KEY = '@onboarding_complete';

export interface OnboardingState {
  hasCompletedOnboarding: boolean;
}

export interface OnboardingActions {
  completeOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
}

export type OnboardingSlice = OnboardingState & OnboardingActions;

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
  // Initial state
  hasCompletedOnboarding: false,

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ hasCompletedOnboarding: true });
  },

  checkOnboardingStatus: async () => {
    const status = await AsyncStorage.getItem(ONBOARDING_KEY);
    set({ hasCompletedOnboarding: status === 'true' });
  },
});
