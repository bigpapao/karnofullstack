import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { forgotPassword, clearError } from '../store/slices/authSlice'; // Import thunk and action

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: authError, successMessage } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateEmail = () => {
    const emailRegex = /^[\u0600-\u06FF\s\w.-]+@[\u0600-\u06FF\s\w.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError('ایمیل الزامی است');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('فرمت ایمیل نامعتبر است');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    dispatch(forgotPassword(email));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h1">
            فراموشی رمز عبور
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            component={RouterLink} 
            to="/login"
          >
            بازگشت به ورود
          </Button>
        </Box>
        
        {authError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {authError}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {successMessage ? (
          <Box>
            <Typography paragraph>
              ما دستورالعمل بازنشانی رمز عبور را به <strong>{email}</strong> ارسال کردیم.
              لطفاً صندوق ورودی خود را بررسی کرده و پیوند موجود در ایمیل را دنبال کنید.
            </Typography>
            <Typography paragraph>
              اگر ظرف چند دقیقه ایمیلی دریافت نکردید، لطفاً پوشه اسپم خود را بررسی کنید.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink} 
              to="/login"
              fullWidth
              sx={{ mt: 2 }}
            >
              بازگشت به صفحه ورود
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography paragraph>
              آدرس ایمیل خود را وارد کنید تا دستورالعمل بازنشانی رمز عبور را برایتان ارسال کنیم.
            </Typography>
            
            <TextField
              fullWidth
              label="آدرس ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              autoFocus
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading} 
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ارسال دستورالعمل بازنشانی'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                رمز عبور خود را به خاطر دارید؟ وارد شوید
              </Link>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
