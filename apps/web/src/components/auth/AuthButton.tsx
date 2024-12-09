'use client';

import { Button } from '@mui/material';
import { useState } from 'react';
import { useAuthSlice } from '@/store/slices/useAuthSlice';
import { AuthDialog } from './AuthDialog';

export function AuthButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthSlice();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-200">
          Welcome, {user.email}
        </span>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          size="small"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setIsDialogOpen(true)}
        size="small"
      >
        Sign In
      </Button>
      <AuthDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
