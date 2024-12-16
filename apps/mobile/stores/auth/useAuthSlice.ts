import "@service/reflect";
import {
  AuthService,
  User,
  SecureStorageError,
  Tokens,
} from "@service/auth";
import { container } from "tsyringe";

import { StateCreator } from "zustand";
import { trpc } from "@/utils/trpc";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEYS } from "@/utils/trpc";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const result = await container
        .resolve(AuthService)
        .login(email, password);

      set({
        isAuthenticated: true,
        user: { ...result.user },
      });
    } catch (error) {
      if (error instanceof SecureStorageError) {
        throw error;
      }
      console.error("Login error:", error);
      // alert("Authentication failed. Please try again.");
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const result = await container
        .resolve(AuthService)
        .signup(name, email, password);

      set({
        isAuthenticated: true,
        user: { ...result.user },
      });
    } catch (error) {
      if (error instanceof SecureStorageError) {
        throw error;
      }
      console.error("Signup error:", error);
      // alert("Registration failed. Please try again.");
    }
  },

  resetPassword: async (email: string) => {
    // TODO: Implement password reset functionality
  },

  logout: async () => {
    try {
      await container.resolve(AuthService).logout();
      // Clear memory state
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // alert("Error during logout. Your session has been cleared locally.");
    }
  },



  fetchUser: async () => {
    try {
      const user = await container.resolve(AuthService).fetchUser();
      set({ user: { ...user }, isAuthenticated: true });
    } catch (error) {
      // If fetch fails, log the user out
      await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
      set({ user: null, isAuthenticated: false });
      // console.error("User fetch error:", error);
      // alert("Your session has expired. Please login again.");
    }
  },
});
