import { StateCreator } from 'zustand';
import { trpc } from '../../utils/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REFRESH_TOKEN_KEY = '@auth_refresh_token';

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  // Initial state
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const result: {user: User, tokens: tokens} = await trpc.auth.login.mutate({ email, password });
      // Store refresh token in secure storage
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, result.tokens.refreshToken);
      // Only store access token and user info in memory
      set({ 
        isAuthenticated: true, 
        user: {...result.user}, 
        accessToken: result.tokens.accessToken 
      });
    } catch (error) {
      alert(error);
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const result: {user: User, tokens: tokens} = await trpc.auth.signup.mutate({ name, email, password });
      // Store refresh token in secure storage
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, result.tokens.refreshToken);
      // Only store access token and user info in memory
      set({ 
        isAuthenticated: true, 
        user: {...result.user}, 
        accessToken: result.tokens.accessToken 
      });
    } catch (error) {
      alert(error);
    }
  },

  resetPassword: async (email: string) => {
    // TODO: Implement password reset functionality
  },

  logout: async () => {
    try {
      await trpc.auth.logout.mutate();
      // Clear refresh token from secure storage
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      // Clear memory state
      set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      });
    } catch (error) {
      // Even if the server request fails, we still want to clear the state
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      });
      alert(error);
    }
  },

  refresh: async () => {
    try {
      // Get refresh token from secure storage
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      const result: {tokens: tokens} = await trpc.auth.refresh.mutate();
      // Store new refresh token
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, result.tokens.refreshToken);
      // Update only access token in memory
      set({ accessToken: result.tokens.accessToken });
    } catch (error) {
      // If refresh fails, log the user out
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      });
      alert(error);
    }
  },

  // fetchUser: async () => {
  //   try {
  //     const result: {user: User, tokens: tokens} = await trpc.auth.me.query();
  //     // Store refresh token in secure storage
  //     await AsyncStorage.setItem(REFRESH_TOKEN_KEY, result.tokens.refreshToken);
  //     // Only store access token and user info in memory
  //     set({ 
  //       isAuthenticated: true, 
  //       user: {...result.user}, 
  //       accessToken: result.tokens.accessToken 
  //     });
  //   } catch (error) {
  //     // If fetch fails, log the user out
  //     await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  //     set({ 
  //       user: null, 
  //       accessToken: null, 
  //       isAuthenticated: false 
  //     });
  //     alert(error);
  //   }
  // },
});