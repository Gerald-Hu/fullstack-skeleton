'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSlice } from '@/store/slices/useAuthSlice';
import { CircularProgress } from '@mui/material';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchUser } = useAuthSlice();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();
      setIsInitialLoading(false);
    };
    checkAuth();
  }, [fetchUser]);

  // Redirect if not authenticated after loading
  useEffect(() => {
    if (!isInitialLoading && !isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isInitialLoading, isLoading, isAuthenticated, router]);

  if (isInitialLoading || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
