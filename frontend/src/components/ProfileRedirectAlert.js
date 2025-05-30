import React, { useEffect } from 'react';

/**
 * Alert component shown when user is redirected from checkout to profile
 * Explains what's missing and why they're being redirected
 * Auto-dismisses after a few seconds
 * 
 * @param {Object} props - Component props
 * @param {Function} props.setShowRedirectAlert - Function to change alert visibility
 * @param {Object} props.profileStatus - Status of user profile completion
 * @returns {JSX.Element} The alert component
 */
const ProfileRedirectAlert = ({ setShowRedirectAlert, profileStatus }) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRedirectAlert(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [setShowRedirectAlert]);
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 px-4 py-6">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-scale-in">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
            <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mr-3 text-lg font-medium text-gray-900">
            تکمیل اطلاعات حساب کاربری
          </h3>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-3">
            برای ادامه فرآیند خرید، ابتدا باید اطلاعات حساب کاربری خود را تکمیل کنید.
          </p>
          
          <div className="bg-amber-50 border-r-4 border-amber-500 p-3 rounded-md">
            <p className="text-sm font-medium text-amber-800 mb-2">موارد ناقص:</p>
            <ul className="list-disc mr-5 text-sm text-amber-700">
              {!profileStatus?.isProfileComplete && (
                <li>اطلاعات پروفایل (نام، آدرس، کد پستی و ...)</li>
              )}
              {!profileStatus?.isMobileVerified && (
                <li>تایید شماره موبایل</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="text-right">
          <button
            onClick={() => setShowRedirectAlert(false)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            تکمیل اطلاعات پروفایل
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileRedirectAlert; 