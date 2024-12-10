// HOF version for function components and const closures
import { trpc } from '@utils/trpc';

/**
 * Wraps a function with a token refresh mechanism. Make sure the wrapped function throws an error if the token is expired.
 * 
 * @param fn The function to wrap.
 * @returns The wrapped function.
 */
export const withRefresh = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
): T => {
  return async function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    
    try {
      const result = await fn.apply(this, args);
      return result;
    } catch (error: any) {
      // Check if error is due to expired token
      if (error?.data?.code === 'UNAUTHORIZED') {
        try {
          // Attempt to refresh the token
          await trpc.auth.refresh.mutate();
          // Retry the original request
          return await fn.apply(this, args);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw refreshError;
        }
      }
      
      console.error(`Error in tRPC call:`, error);
      throw error;
    }
  } as T;
};

// Example usage with function:
/*
const myFunction = withRefresh(
  async () => {
    return await trpc.someEndpoint.query();
  },
  'myFunction'
);
*/