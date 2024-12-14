import "@service/reflect";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEYS, withTokenRefresh, trpc, setBearerToken } from "@utils/trpc";
import { injectable, singleton } from "tsyringe";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class SecureStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecureStorageError";
  }
}

@injectable()
@singleton()
export class AuthService {

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; tokens: Tokens }> {

    const result = await trpc.auth.login.mutate({ email, password });
    setBearerToken(result.tokens.accessToken);

    // Store tokens in secure storage
    try {
      await SecureStore.setItemAsync(
        TOKEN_KEYS.REFRESH_TOKEN,
        result.tokens.refreshToken
      );
      await SecureStore.setItemAsync(
        TOKEN_KEYS.ACCESS_TOKEN,
        result.tokens.accessToken
      );
    } catch (error) {
      throw new SecureStorageError("Failed to store tokens in secure storage");
    }

    return result;
  }

  async signup(
    name: string,
    email: string, 
    password: string
  ): Promise<{ user: User; tokens: Tokens }> {
    const result = await trpc.auth.signup.mutate({ name, email, password });
    setBearerToken(result.tokens.accessToken);

    // Store tokens in secure storage
    try {
      await SecureStore.setItemAsync(
        TOKEN_KEYS.REFRESH_TOKEN,
        result.tokens.refreshToken
      );
      await SecureStore.setItemAsync(
        TOKEN_KEYS.ACCESS_TOKEN,
        result.tokens.accessToken
      );
    } catch (error) {
      throw new SecureStorageError("Failed to store tokens in secure storage");
    }

    return result;
  }

  @withTokenRefresh()
  async fetchUser(): Promise<User> {
    const accessToken = await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
    // if (!accessToken) {
    //   throw new Error("No access token found");
    // }
    setBearerToken(accessToken ?? "");
    return await trpc.auth.me.query();
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      setBearerToken(refreshToken);

      await trpc.auth.logout.mutate();
      
      // Clear tokens from secure storage
      await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
    } catch (error) {
      // Even if server request fails, still clear tokens
      await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
      throw error;
    }
  }
}