'use client'
import { Button } from '@mui/material';
import { useAuthSlice } from '@/store/slices/useAuthSlice';
import { trpc } from '@/utils/trpc';

export const RefreshTokenButton = () => {
  const { isAuthenticated } = useAuthSlice();

  const handleRefresh = async () => {
    try {
      await trpc.auth.refresh.mutate();
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleRefresh}
    >
      Refresh Token
    </Button>
  );
};
