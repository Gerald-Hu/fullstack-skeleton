import { create } from 'zustand';
import { trpc } from '@/utils/trpc';
import { loginSchema, signupSchema } from '../../../../api/src/auth/auth.router';
import { z } from 'zod';

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  fetchUser: () => Promise<void>;
}

export type AuthSlice = AuthState & AuthActions;

export const useAuthSlice = create<AuthSlice>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await trpc.auth.login.mutate({ email, password });
      const user = await trpc.auth.me.query();
      if (!user) {
        throw new Error('Login failed');
      }
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred during login',
        isLoading: false,
      });
    }
  },

  signup: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      await trpc.auth.signup.mutate({ email, password, name });
      const user = await trpc.auth.me.query();
      if (!user) {
        throw new Error('Signup failed');
      }
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred during signup',
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await trpc.auth.logout.mutate();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred during logout',
        isLoading: false,
      });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await trpc.auth.me.query();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement password reset functionality
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred during password reset',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
