import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  styled,
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  Sms as SmsIcon, 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { requestPhoneVerification, verifyPhone, updateProfile, login } from '../store/slices/authSlice';
import { normalizePhoneNumber } from '../utils/phoneUtils';

/**
 * AuthModal Component
 * 
 * A modal component for user authentication including phone verification,
 * password setup, and user profile completion.
 */

// Styled components to ensure proper loading
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(4),
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-root': {
    background: theme.palette.background.paper,
  },
}));

const AuthModal = ({ open, onClose, redirectAfterLogin = '/' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, isAuthenticated } = useSelector((state) => state.auth);
  
  // States for authentication flow
  const [step, setStep] = useState('phone'); // 'phone', 'verification', 'password', or 'profile'
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [localSuccessMessage, setLocalSuccessMessage] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
  const [codeExpiryTime, setCodeExpiryTime] = useState(null);
  
  // Set loaded state after initial render
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Handle countdown for resending verification code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle countdown for rate limiting
  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => setRateLimitCountdown(rateLimitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (rateLimitCountdown === 0 && rateLimited) {
      setRateLimited(false);
    }
  }, [rateLimitCountdown, rateLimited]);
  
  // Handle successful login/registration
  useEffect(() => {
    if (isAuthenticated && successMessage && !verificationSuccess) {
      setLocalSuccessMessage(successMessage);
      setIsSubmitting(false);
      
      // Redirect after a short delay to show the success message
      const timer = setTimeout(() => {
        onClose();
        navigate(redirectAfterLogin, { replace: true });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, successMessage, navigate, onClose, redirectAfterLogin, verificationSuccess]);
  
  // Update local submitting state based on global loading state
  useEffect(() => {
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [loading]);
  
  const validatePhone = () => {
    // Iranian mobile number validation - must start with 0 followed by 9, or just 9, and have correct length
    const phoneRegex = /^(0?9\d{9})$/;
    
    if (!phone) {
      setFormErrors({ phone: 'شماره موبایل الزامی است' });
      return false;
    } else if (!phoneRegex.test(phone)) {
      setFormErrors({ phone: 'شماره موبایل باید با 9 شروع شود و 10 رقم باشد' });
      return false;
    }
    
    setFormErrors({});
    return true;
  };
  
  const validateVerificationCode = () => {
    if (!verificationCode) {
      setFormErrors({ code: 'کد تایید الزامی است' });
      return false;
    } else if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setFormErrors({ code: 'کد تایید باید 6 رقم باشد' });
      return false;
    }
    
    setFormErrors({});
    return true;
  };
  
  const validateProfile = () => {
    const errors = {};
    
    if (!firstName.trim()) {
      errors.firstName = 'نام الزامی است';
    }
    
    if (!lastName.trim()) {
      errors.lastName = 'نام خانوادگی الزامی است';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone()) return;
    
    setIsSubmitting(true);
    
    try {
      const normalizedPhone = normalizePhoneNumber(phone);
      const result = await dispatch(requestPhoneVerification({ phone: normalizedPhone, purpose: 'login' })).unwrap();
      
      // Store expiryTime if available
      if (result.expiresAt) {
        setCodeExpiryTime(new Date(result.expiresAt));
      }
      
      // Set countdown for resending
      setCountdown(result.waitTime || 120);
      
      // Move to verification step
      setStep('verification');
      
      // Show success message
      setLocalSuccessMessage('کد تایید به شماره موبایل شما ارسال شد');
    } catch (err) {
      console.error('Error requesting verification:', err);
      setIsSubmitting(false);
      
      // Handle rate limiting
      if (err.rateLimited) {
        setRateLimited(true);
        setRateLimitCountdown(err.rateLimitSeconds || 60);
      }
      
      if (err.attemptsRemaining !== undefined) {
        setAttemptsRemaining(err.attemptsRemaining);
      }
      
      setFormErrors({ phone: err.message || 'خطا در ارسال کد تایید. لطفا دوباره تلاش کنید.' });
    }
  };
  
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateVerificationCode()) return;
    
    setIsSubmitting(true);
    
    try {
      const normalizedPhone = normalizePhoneNumber(phone);
      const result = await dispatch(verifyPhone({ 
        phone: normalizedPhone, 
        code: verificationCode, 
        firstName, 
        lastName 
      })).unwrap();
      
      // Check if this is a new user
      if (result.data?.user) {
        setVerificationSuccess(true);
        
        // Check if user has password set
        if (result.data.isNewUser) {
          // New user needs to set password
          setStep('password');
        } else if (result.data.user.firstName && result.data.user.lastName) {
          // Existing user with complete profile, redirect
          setTimeout(() => {
            onClose();
            navigate(redirectAfterLogin, { replace: true });
          }, 2000);
        } else {
          // Existing user but needs to complete profile
          setStep('profile');
        }
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setIsSubmitting(false);
      
      // Update remaining attempts if available
      if (err.attemptsRemaining !== undefined) {
        setAttemptsRemaining(err.attemptsRemaining);
      }
      
      setFormErrors({ code: err.message || 'کد تایید نامعتبر است. لطفا دوباره تلاش کنید.' });
    }
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;
    
    setIsSubmitting(true);
    
    try {
      // Update user profile with name
      await dispatch(updateProfile({ firstName, lastName })).unwrap();
      
      // Show success message and redirect
      setLocalSuccessMessage('حساب کاربری شما با موفقیت ایجاد شد. اکنون می‌توانید به خرید خود ادامه دهید.');
      
      // Redirect after a short delay
      setTimeout(() => {
        onClose();
        navigate(redirectAfterLogin, { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setIsSubmitting(false);
      setFormErrors({ general: err.message || 'خطا در بروزرسانی پروفایل. لطفا دوباره تلاش کنید.' });
    }
  };
  
  const handleResendCode = async () => {
    if (countdown > 0 || rateLimited) return;
    
    try {
      const purpose = 'login'; // or 'register' based on your flow
      const result = await dispatch(requestPhoneVerification({ phone, purpose })).unwrap();
      
      // Set countdown based on server response or default to 5 minutes
      const expiryTime = result.expiresAt ? new Date(result.expiresAt) : new Date(Date.now() + 5 * 60 * 1000);
      setCodeExpiryTime(expiryTime);
      
      // Calculate seconds remaining
      const secondsRemaining = Math.floor((expiryTime - new Date()) / 1000);
      setCountdown(secondsRemaining > 0 ? secondsRemaining : 300);
      
      setLocalSuccessMessage(`کد تایید جدید به شماره ${phone} ارسال شد`);
      setAttemptsRemaining(3); // Reset attempts
      
      // Clear success message after 5 seconds
      setTimeout(() => setLocalSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error resending code:', err);
      
      // Handle rate limiting
      if (err.retryAfter) {
        setRateLimited(true);
        setRateLimitCountdown(err.retryAfter);
        setFormErrors({ 
          general: `تعداد درخواست‌های شما بیش از حد مجاز است. لطفا ${Math.ceil(err.retryAfter / 60)} دقیقه دیگر تلاش کنید.` 
        });
      } else {
        setFormErrors({ general: err.message || 'خطا در ارسال مجدد کد تایید. لطفا دوباره تلاش کنید.' });
      }
    }
  };
  
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatRateLimitCountdown = () => {
    const hours = Math.floor(rateLimitCountdown / 3600);
    const minutes = Math.floor((rateLimitCountdown % 3600) / 60);
    const seconds = rateLimitCountdown % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Validate password fields
  const validatePassword = () => {
    const errors = {};
    
    if (!password) {
      errors.password = 'رمز عبور الزامی است';
    } else if (password.length < 6) {
      errors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'تکرار رمز عبور الزامی است';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setIsSubmitting(true);
    
    try {
      // Call API to set password for the user
      await dispatch(updateProfile({ phone, password })).unwrap();
      
      // Show success message
      setLocalSuccessMessage('رمز عبور با موفقیت ثبت شد');
      
      // Move to profile completion if needed, otherwise redirect
      setTimeout(() => {
        if (firstName && lastName) {
          // User already has name, redirect
          onClose();
          navigate(redirectAfterLogin, { replace: true });
        } else {
          // User needs to complete profile
          setStep('profile');
        }
      }, 2000);
    } catch (err) {
      console.error('Error setting password:', err);
      setIsSubmitting(false);
      setFormErrors({ general: err.message || 'خطا در ثبت رمز عبور. لطفا دوباره تلاش کنید.' });
    }
  };
  
  // Handle direct login with phone and password
  const handlePhonePasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!validatePhone() || !password) {
      if (!password) setFormErrors({ ...formErrors, password: 'رمز عبور الزامی است' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const normalizedPhone = normalizePhoneNumber(phone);
      
      // Get session ID from localStorage if available (for guest cart)
      const sessionId = localStorage.getItem('sessionId');
      
      await dispatch(login({ 
        phone: normalizedPhone, 
        password,
        sessionId // Include session ID for merging guest cart
      })).unwrap();
      
      // Show success message and redirect
      setLocalSuccessMessage('ورود با موفقیت انجام شد');
      
      // Redirect after a short delay
      setTimeout(() => {
        onClose();
        navigate(redirectAfterLogin, { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Login error:', err);
      setIsSubmitting(false);
      setFormErrors({ general: err.message || 'خطا در ورود. شماره موبایل یا رمز عبور اشتباه است.' });
    }
  };
  
  // Simplified handleClose function to ensure it works reliably
  const handleClose = () => {
    // Immediately reset state
    setStep('phone');
    setPhone('');
    setVerificationCode('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setFormErrors({});
    setLocalSuccessMessage('');
    setVerificationSuccess(false);
    
    // Directly call the onClose prop which is connected to closeAuthModal in AuthModalContext
    if (typeof onClose === 'function') {
      onClose();
    }
  };
  
  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      disableEnforceFocus
    >
      <DialogTitle sx={{ textAlign: 'center', py: 2 }}>
        {step === 'phone' ? 'ورود / ثبت نام' : 
         step === 'verification' ? 'تایید شماره موبایل' : 
         step === 'password' ? 'تنظیم رمز عبور' :
         'تکمیل اطلاعات کاربری'}
      </DialogTitle>
      
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
        {(localSuccessMessage || successMessage) && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {typeof (localSuccessMessage || successMessage) === 'object' 
              ? ((localSuccessMessage || successMessage).message || JSON.stringify(localSuccessMessage || successMessage)) 
              : (localSuccessMessage || successMessage)}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === 'object' ? (error.message || JSON.stringify(error)) : error}
          </Alert>
        )}
        
        {formErrors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formErrors.general}
          </Alert>
        )}
        
        {isLoaded && step === 'phone' ? (
          <Box component="form" onSubmit={handlePhoneSubmit} noValidate sx={{ mt: 2 }}>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="شماره موبایل"
              name="phone"
              autoComplete="tel"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ direction: 'rtl' }}
            />
            
            <StyledTextField
              margin="normal"
              fullWidth
              id="password"
              label="رمز عبور (اختیاری)"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ direction: 'rtl' }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ width: '48%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'دریافت کد تایید'}
              </Button>
              
              <Button
                onClick={handlePhonePasswordLogin}
                variant="outlined"
                sx={{ width: '48%' }}
                disabled={isSubmitting || !password}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'ورود با رمز عبور'}
              </Button>
            </Box>
            
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              با ورود یا ثبت نام، شما شرایط و قوانین استفاده از خدمات و حریم خصوصی ما را می‌پذیرید.
            </Typography>
          </Box>
        ) : null}
        
        {step === 'verification' ? (
          <Box component="form" onSubmit={handleVerificationSubmit} noValidate>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="کد تایید"
              name="verificationCode"
              autoComplete="one-time-code"
              autoFocus
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              error={!!formErrors.code}
              helperText={formErrors.code}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SmsIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ direction: 'rtl' }}
            />
            
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              کد تایید به شماره {phone} ارسال شد
            </Typography>
            
            <Typography variant="body2" align="center" sx={{ mt: 1, color: attemptsRemaining < 2 ? 'error.main' : 'text.secondary' }}>
              {attemptsRemaining > 0 ? `تعداد تلاش‌های باقیمانده: ${attemptsRemaining}` : 'تلاش‌های شما تمام شده. لطفا کد جدید درخواست کنید.'}
            </Typography>
            
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              زمان باقیمانده: {formatCountdown()}
            </Typography>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || attemptsRemaining <= 0}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'تایید و ورود'}
            </Button>
            
            {rateLimited && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                تعداد درخواست‌های شما بیش از حد مجاز است. لطفا {formatRateLimitCountdown()} دیگر تلاش کنید.
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                color="secondary"
                onClick={handleResendCode}
                disabled={countdown > 0 || isSubmitting || rateLimited}
              >
                {countdown > 0 ? `ارسال مجدد کد (${formatCountdown()})` : 'ارسال مجدد کد'}
              </Button>
            </Box>
          </Box>
        ) : step === 'password' ? (
          <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              لطفا یک رمز عبور برای ورود‌های بعدی خود انتخاب کنید
            </Typography>
            
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="رمز عبور"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ direction: 'rtl' }}
            />
            
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="تکرار رمز عبور"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ direction: 'rtl' }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'ثبت رمز عبور'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleProfileSubmit} noValidate>
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              لطفا اطلاعات خود را تکمیل کنید
            </Typography>
            
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="نام"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              sx={{ direction: 'rtl' }}
            />
            
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="نام خانوادگی"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              sx={{ direction: 'rtl' }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'ثبت اطلاعات و ادامه'}
            </Button>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          color="primary"
          size="medium"
          data-testid="cancel-button"
          sx={{ minWidth: '80px' }}
        >
          انصراف
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

// Export the component as default
export default AuthModal;
