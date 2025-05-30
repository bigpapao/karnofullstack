import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ mb: 3, bgcolor: '#1e3a8a' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <DashboardIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            پنل مدیریت کارنو
          </Typography>

          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ direction: 'rtl' }}
          >
            خروج
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AdminHeader;
