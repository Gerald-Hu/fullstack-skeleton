import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSlice, createAuthSlice } from './auth/useAuthSlice';

// Define the shape of our entire store
interface StoreState extends AuthSlice {
  // Add other slices here as we create them
  // example: UISlice, SettingsSlice, etc.
}

// Create the store with persistence
export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      // Add other slices here
      // ...createUISlice(...a),
      // ...createSettingsSlice(...a),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain paths
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);