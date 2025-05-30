import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Snackbar, 
  Alert, 
  Button, 
  Box,
  Typography,
  Slide
} from '@mui/material';
import { useAuthModal } from '../contexts/AuthModalContext';

/**
 * Notification component that appears when a user tries to interact with the cart
 * while not being authenticated
 */
const CartAuthNotification = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const { openAuthModal } = useAuthModal();
  
  // Show notification when items are added to cart but user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isAuthenticated, items]);
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleLogin = () => {
    openAuthModal('/cart');
    setOpen(false);
  };
  
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
    >
      <Alert 
        severity="info" 
        variant="filled"
        sx={{ 
          width: '100%', 
          maxWidth: 400,
          direction: 'rtl', // Ensure RTL direction for Persian text
          '& .MuiAlert-message': {
            width: '100%' // Ensure the message takes full width for proper RTL alignment
          }
        }}
      >
        <Typography variant="body2" gutterBottom sx={{ textAlign: 'right' }}>
          برای تکمیل خرید، لطفا وارد حساب کاربری خود شوید.
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            size="small" 
            color="inherit" 
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            بعداً
          </Button>
          <Button 
            size="small" 
            color="inherit" 
            variant="outlined"
            onClick={handleLogin}
          >
            ورود / ثبت نام
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CartAuthNotification;
