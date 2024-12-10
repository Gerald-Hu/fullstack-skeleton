import { create } from 'zustand';
import { trpc } from '@/utils/trpc';
import { loginSchema, signupSchema } from '../../../../api/src/auth/auth.router';
import { withRefresh } from '@/utils/token-refresh';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
}).strict();

export type User = z.infer<typeof userSchema>;

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
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await trpc.auth.login.mutate({ email, password });
      const user = await trpc.auth.me.query();
      set({
        user: userSchema.parse(user),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during login',
      });
    }
  },

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      await trpc.auth.signup.mutate({ email, password, name });
      const user = await trpc.auth.me.query();
      set({
        user: userSchema.parse(user),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during signup',
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
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

  fetchUser: withRefresh(async () => {
    set({ isLoading: true });
    try {
      const user = await trpc.auth.me.query();
      if (user) {
        set({
          user: userSchema.parse(user),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  }),

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement password reset functionality
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during password reset',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
