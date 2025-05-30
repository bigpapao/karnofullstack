import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthModal from '../components/AuthModal';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import SEO from '../components/SEO';

const PhoneLogin = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
  
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <>
      <SEO 
        title="ورود | کارنو" 
        description="ورود به حساب کاربری در فروشگاه اینترنتی کارنو. خرید قطعات و لوازم یدکی خودرو با گارانتی اصالت و کیفیت."
        canonical="https://karno.ir/login"
      />
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <AuthModal isPage />
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default PhoneLogin;
