import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../store/slices/authSlice';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useDispatch();

  const { loading, error: reduxError, successMessage } = useSelector((state) => state.auth);

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      dispatch(clearError());
    } else {
      setTokenValid(true);
      dispatch(clearError());
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, dispatch]);

  useEffect(() => {
    if (reduxError) {
      // Optionally, set local error or rely on global display
    }
  }, [reduxError]);

  useEffect(() => {
    if (successMessage) {
      // Optionally, navigate or clear form after a delay
      // For now, success UI is handled by checking successMessage directly in render
    }
  }, [successMessage, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!passwordData.newPassword) {
      errors.newPassword = 'رمز عبور جدید الزامی است';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'لطفاً رمز عبور جدید خود را تأیید کنید';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'رمزهای عبور مطابقت ندارند';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(clearError());

    dispatch(resetPassword({ token, password: passwordData.newPassword }));
  };

  if (!tokenValid && !reduxError) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            مشکل لینک بازنشانی رمز عبور
          </Typography>

          <Alert severity="error" sx={{ mb: 3 }}>
            لینک بازنشانی رمز عبور نامعتبر یا منقضی شده است. لطفاً یک لینک جدید درخواست کنید.
          </Alert>

          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/forgot-password"
            fullWidth
          >
            درخواست لینک جدید
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/login"
            sx={{ mr: 2 }}
          >
            بازگشت به صفحه ورود
          </Button>
          <Typography variant="h4" component="h1">
            بازنشانی رمز عبور
          </Typography>
        </Box>

        {reduxError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {reduxError}
          </Alert>
        )}

        {successMessage ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
            <Typography paragraph>
              رمز عبور شما به‌روزرسانی شد. اکنون می‌توانید با رمز عبور جدید خود وارد شوید.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/login"
              fullWidth
              sx={{ mt: 2 }}
            >
              رفتن به صفحه ورود
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography paragraph>
              لطفاً رمز عبور جدید خود را در زیر وارد کنید.
            </Typography>

            <TextField
              fullWidth
              label="رمز عبور جدید"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handleChange}
              error={!!formErrors.newPassword || !!reduxError}
              helperText={formErrors.newPassword}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="تأیید رمز عبور جدید"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword || !!reduxError}
              helperText={formErrors.confirmPassword}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'بازنشانی رمز عبور'}
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
