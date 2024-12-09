'use client';
import { createContext, useContext, useRef, useEffect } from 'react';
import { useAuthSlice, type AuthSlice } from './slices/useAuthSlice';

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
    storeRef.current.auth.fetchUser();
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
