import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './auth/useAuthSlice';

// Define the shape of our entire store
interface StoreState extends AuthSlice {
  // Add other slices here as we create them
  // example: UISlice, SettingsSlice, etc.
}

// Create the store without persistence for auth state
export const useStore = create<StoreState>((...a) => ({
  ...createAuthSlice(...a),
  // Add other slices here
  // ...createUISlice(...a),
  // ...createSettingsSlice(...a),
}));