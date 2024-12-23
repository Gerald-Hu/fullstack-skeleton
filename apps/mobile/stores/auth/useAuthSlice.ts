import "@service/reflect";
import {
  AuthService,
  User,
  SecureStorageError,
} from "@service/auth";
import { container } from "tsyringe";
import { SliceCreator } from "..";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEYS } from "@/utils/trpc";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: SliceCreator<AuthSlice> = (set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const result = await container
        .resolve(AuthService)
        .login(email, password);

      set(state => ({
        auth: {
          ...state.auth,
          user: result.user,
          isAuthenticated: true
        }
      }));
    } catch (error) {
      if (error instanceof SecureStorageError) {
        throw error;
      }
      console.error("Login error:", error);
      // alert("Authentication failed. Please try again.");
    }
  },

  loginWithGoogle: async (idToken: string) => {
    try {
      const result = await container
        .resolve(AuthService)
        .loginWithGoogle(idToken);
        
      set(state => ({
        auth: {
          ...state.auth,
          user: { ...result.user },
          isAuthenticated: true
        }
      }));
    } catch (error) {
      if (error instanceof SecureStorageError) {
        throw error;
      }
      console.error("Login with Google error:", error);
      // alert("Authentication failed. Please try again.");
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const result = await container
        .resolve(AuthService)
        .signup(name, email, password);

      set(state => ({
        auth: {
          ...state.auth,
          user: { ...result.user },
          isAuthenticated: true
        }
      }));
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
      set(state => ({
        auth: {
          ...state.auth,
          user: null,
          isAuthenticated: false,
        }
      }));
    } catch (error) {
      console.error("Logout error:", error);
      // alert("Error during logout. Your session has been cleared locally.");
    }
  },



  fetchUser: async () => {
    try {
      const user = await container.resolve(AuthService).fetchUser();
      set(state => ({
        auth: {
          ...state.auth,
          user: { ...user },
          isAuthenticated: true
        }
      }));
    } catch (error) {
      // If fetch fails, log the user out
      await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
      set(state => ({
        auth: {
          ...state.auth,
          user: null,
          isAuthenticated: false,
        }
      }));
      // console.error("User fetch error:", error);
      // alert("Your session has expired. Please login again.");
    }
  },
});
