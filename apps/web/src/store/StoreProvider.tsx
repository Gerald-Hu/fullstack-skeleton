'use client';
import { createContext, useContext, useRef, useEffect } from 'react';
import { useAuthSlice, type AuthSlice } from './slices/useAuthSlice';
import { withRefresh } from '@/utils/token-refresh';

// Define the store structure
interface Store {
  auth: AuthSlice;
  // Add other slices here
}

// Create the context
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<Store>({
    auth: useAuthSlice.getState(),
    // Add other slices here
  });

  // Subscribe to changes
  useAuthSlice.subscribe((state) => {
    storeRef.current.auth = state;
  });
  

  // Check authentication status when app loads
  useEffect(() => {
    async function checkAuth() {
      try {
        await storeRef.current.auth.fetchUser();
      } catch (error) {
        console.log(error);
      }
    }
    checkAuth();
  }, []);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to use the store
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
}
