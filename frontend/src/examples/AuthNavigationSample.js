import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Sample navigation component showing how to integrate auth links
 * This is just an example - implement in your actual navigation component
 */
const AuthNavigationSample = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center space-x-4 mr-4">
      {isAuthenticated ? (
        <div className="flex items-center">
          <div className="mr-2">
            <span className="text-sm text-gray-700">
              سلام، {user?.firstName || 'کاربر'}
            </span>
          </div>
          <Link 
            to="/profile"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            حساب کاربری
          </Link>
        </div>
      ) : (
        <>
          <Link 
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ورود
          </Link>
          <Link 
            to="/register"
            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            ثبت نام
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthNavigationSample; 