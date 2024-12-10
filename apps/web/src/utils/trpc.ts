import { createTRPCProxyClient, httpLink } from '@trpc/client';
import type { AppRouter } from '../../../api/src/@generated/server';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:3001/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // Needed for cookies
        });
      },
    }),
  ],
});
