import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileStatus } from '../store/slices/authSlice';
import ProfileRedirectAlert from './ProfileRedirectAlert';

/**
 * Checkout Guard component that prevents users from accessing checkout
 * if their profile is incomplete or mobile not verified
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if requirements are met
 * @returns {React.ReactNode} The child components or a redirect
 */
const CheckoutGuard = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, loading, profileStatus, profileStatusLoading } = useSelector((state) => state.auth);
  const [showRedirectAlert, setShowRedirectAlert] = useState(false);
  
  // Fetch profile status when the component mounts
  useEffect(() => {
    if (isAuthenticated && !profileStatus) {
      dispatch(getProfileStatus());
    }
  }, [isAuthenticated, dispatch, profileStatus]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Show loading state while checking status
  if (loading || profileStatusLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // If we have profile status and it indicates the user can't checkout
  if (profileStatus && !profileStatus.canCheckout) {
    // Show redirect alert
    if (!showRedirectAlert) {
      setShowRedirectAlert(true);
      return <ProfileRedirectAlert setShowRedirectAlert={setShowRedirectAlert} profileStatus={profileStatus} />;
    }
    
    // Redirect to profile page after showing alert
    return <Navigate to="/profile" replace />;
  }
  
  // If user is authenticated and has completed their profile, show the protected content
  return children;
};

export default CheckoutGuard; 