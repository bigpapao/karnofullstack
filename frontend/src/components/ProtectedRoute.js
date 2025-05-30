import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute component that guards routes requiring authentication
 * Redirects to login page if user is not authenticated
 * Preserves the original URL for redirect after login
 * Uses authChecked to wait for auth status verification
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render if authenticated
 * @returns {React.ReactNode} The protected component or a redirect
 */
const ProtectedRoute = ({ children }) => {
  const { user, authChecked } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Show loading state while checking authentication status
  if (!authChecked) {
    return <LoadingSpinner />;
  }
  
  // If not authenticated, redirect to login with the current path in state
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace
      />
    );
  }
  
  // If authenticated, render the protected route
  return children || <Outlet />;
};

export default ProtectedRoute;
