'use client';

import { Card, CardContent, Typography, Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthSlice } from '@/store/slices/useAuthSlice';

function DashboardContent() {
  const { user } = useAuthSlice();

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name || user?.email}
      </Typography>

      <Grid2 container spacing={4} className="mt-4">
        <Grid2 xs={12} md={6} lg={4}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Overview
              </Typography>
              <Paper className="p-4 bg-slate-50">
                <Typography variant="body1" className="mb-2">
                  Email: {user?.email}
                </Typography>
                <Typography variant="body1" className="mb-2">
                  User ID: {user?.id}
                </Typography>
                {user?.name && (
                  <Typography variant="body1" className="mb-2">
                    Name: {user.name}
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs={12} md={6} lg={4}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Paper className="p-4 bg-slate-50">
                <Typography variant="body2" color="text.secondary">
                  No recent activity to display
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs={12} md={6} lg={4}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Paper className="p-4 bg-slate-50">
                <Typography variant="body2" color="text.secondary">
                  Coming soon...
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
