import { createTRPCProxyClient, httpLink } from '@trpc/client';
import Constants from 'expo-constants';
import type { AppRouter } from '../../api/src/@generated/server'

// Get the development server URL from Expo constants
const getBaseUrl = () => {
  // Get the device's IP address when running in development
  const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
  return `http://${localhost}:3001/trpc`;
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
          credentials: 'omit',
        });
      },
    }),
  ],
});