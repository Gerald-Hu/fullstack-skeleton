import { AppBar, Toolbar, Box } from '@mui/material';
import { RefreshTokenButton } from './auth/RefreshTokenButton';
import { AuthButton } from './auth/AuthButton';

export const Navbar = () => {
  return (
    <AppBar position="static" variant='elevation' color='transparent' >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Use this to test the token refresh mechanism */}
          {/* <RefreshTokenButton /> */}
          <AuthButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
