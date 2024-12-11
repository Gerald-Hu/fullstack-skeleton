import { createTRPCProxyClient, httpLink } from "@trpc/client";
import Constants from "expo-constants";
import type { AppRouter } from "../../api/src/@generated/server";
import * as SecureStore from "expo-secure-store";

// Get the development server URL from Expo constants
const getBaseUrl = () => {
  // Get the device's IP address when running in development
  const localhost = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";
  return `http://${localhost}:3001/trpc`;
};

let bearerToken: string | null = null;

export const setBearerToken = (token: string) => {
  bearerToken = token;
};

export const TOKEN_KEYS = {
  REFRESH_TOKEN: "auth_refresh_token",
  ACCESS_TOKEN: "auth_access_token",
};

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: getBaseUrl(),
      fetch(url, options) {
        return fetch(url, {
          ...options,
          // Omit credentials to avoid sending cookies on mobile.
          // We use bearer tokens for authentication instead.
          credentials: "omit",
        });
      },
      headers() {
        return {
          Authorization: `Bearer ${bearerToken}`,
        };
      },
    }),
  ],
});

export function withTokenRefresh() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        // Check if it's a 403 error
        if (
          error?.data?.httpStatus === 403 ||
          error?.data?.code === "UNAUTHORIZED"
        ) {
          try {
            // Get refresh token
            const refreshToken = await SecureStore.getItemAsync(
              TOKEN_KEYS.REFRESH_TOKEN
            );
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Set the refresh token as bearer for the refresh call
            setBearerToken(refreshToken);

            // Call refresh endpoint
            const result = await trpc.auth.refresh.mutate();

            // Store new tokens
            await SecureStore.setItemAsync(
              TOKEN_KEYS.REFRESH_TOKEN,
              result.tokens.refreshToken
            );
            await SecureStore.setItemAsync(
              TOKEN_KEYS.ACCESS_TOKEN,
              result.tokens.accessToken
            );

            // Set new access token for the retry
            setBearerToken(result.tokens.accessToken);

            // Retry the original request
            return await originalMethod.apply(this, args);
          } catch (refreshError) {
            // If refresh fails, clear tokens and throw error
            await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
            await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
            setBearerToken("");
            throw new Error("Session expired. Please login again.");
          }
        }
        // If it's not a 403 error, rethrow
        throw error;
      }
    };

    return descriptor;
  };
}
