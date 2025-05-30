import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, initializeAuth, syncGuestCart } from '../store/slices/authSlice';
import { initializeCart, fetchCart } from '../store/slices/cartSlice';
import { guestCartUtils } from '../utils/guestCart';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const authCheckAttempted = useRef(false);

  // Initialize app authentication and cart state
  useEffect(() => {
    console.log('Initializing app...');
    
    // Initialize auth state
    dispatch(initializeAuth());
    
    // Check authentication status using HTTP-only cookies
    if (!authCheckAttempted.current) {
      console.log('Checking authentication status...');
      authCheckAttempted.current = true;
      dispatch(checkAuth());
    }
  }, [dispatch]);

  // Initialize guest cart if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const guestCart = guestCartUtils.getCart();
      if (guestCart.length > 0) {
        dispatch(initializeCart(guestCart));
      }
    }
  }, [dispatch, isAuthenticated]);

  // Handle cart operations after user authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if there's a guest cart to sync
      const guestCart = guestCartUtils.getCart();
      
      if (guestCart.length > 0) {
        console.log('Syncing guest cart with user cart...');
        dispatch(syncGuestCart()).then(() => {
          // After syncing, fetch the updated cart
          dispatch(fetchCart());
        });
      } else {
        // No guest cart, just fetch user cart
        console.log('Fetching user cart...');
        dispatch(fetchCart());
      }
    }
  }, [dispatch, isAuthenticated, user]);

  return children;
};

export default AppInitializer;