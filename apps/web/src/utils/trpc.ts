import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../api/src/@generated/server';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
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
