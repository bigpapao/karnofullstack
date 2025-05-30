import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { ShoppingCart as CartIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuthModal } from '../contexts/AuthModalContext';
import { addToCart } from '../utils/cartUtils';
import useTracking from '../hooks/useTracking';

/**
 * Reusable Add to Cart button component
 * Handles authentication check and cart addition in one component
 */
const AddToCartButton = ({ 
  product, 
  quantity = 1, 
  variant = 'contained', 
  size = 'medium',
  fullWidth = false,
  showIcon = true,
  iconOnly = false,
  redirectAfterLogin = '/',
  customText = 'افزودن به سبد خرید',
  disabled = false,
  sx = {}
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { openAuthModal } = useAuthModal();
  const { trackAddToCart } = useTracking();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleAddToCart = () => {
    const added = addToCart(
      product, 
      quantity, 
      dispatch, 
      isAuthenticated, 
      openAuthModal,
      redirectAfterLogin
    );
    
    // Show success message if product was added to cart
    if (added) {
      setSnackbarOpen(true);
      
      // Track add to cart event in Google Analytics
      trackAddToCart(
        product.id,
        product.name,
        product.discountPrice || product.price,
        quantity
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (iconOnly) {
    return (
      <>
        <Tooltip title={customText}>
          <IconButton
            color="primary"
            onClick={handleAddToCart}
            disabled={disabled || !product?.stockQuantity}
            size={size}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            محصول به سبد خرید اضافه شد
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        color="primary"
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || !product?.stockQuantity}
        onClick={handleAddToCart}
        endIcon={showIcon ? <CartIcon /> : null}
        sx={{ direction: 'rtl', ...sx }}
      >
        {product?.stockQuantity ? customText : 'ناموجود'}
      </Button>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          محصول به سبد خرید اضافه شد
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddToCartButton;
