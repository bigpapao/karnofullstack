import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage('ایمیل شما با موفقیت تأیید شد! اکنون می‌توانید وارد شوید.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'تأیید ایمیل با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('لینک تأیید نامعتبر است.');
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '60vh',
          direction: 'rtl',
        }}
      >
        {status === 'verifying' && (
          <>
            <CircularProgress size={60} />
            <Typography variant="h5" sx={{ mt: 3, textAlign: 'center' }}>
              در حال تأیید ایمیل شما...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <Alert severity="success" sx={{ width: '100%', mt: 3 }}>
            {message}
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ width: '100%', mt: 3 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmail; 