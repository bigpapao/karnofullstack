import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Banner component that displays profile completion status
 * Shows warnings about incomplete profile or unverified mobile number
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isProfileComplete - Whether the user profile is complete
 * @param {boolean} props.isMobileVerified - Whether the user's mobile number is verified
 * @returns {JSX.Element} The banner component
 */
const ProfileCompletionBanner = ({ isProfileComplete, isMobileVerified }) => {
  // If profile is complete and mobile is verified, don't show banner
  if (isProfileComplete && isMobileVerified) {
    return null;
  }
  
  return (
    <div className="bg-amber-50 border-r-4 border-amber-500 p-4 mb-6 rounded-md shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-amber-500" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="mr-3">
          <h3 className="text-sm font-medium text-amber-800">
            تکمیل حساب کاربری
          </h3>
          
          <div className="mt-2 text-sm text-amber-700">
            <p className="mb-1">
              برای امکان ثبت سفارش و نهایی کردن خرید، لطفا موارد زیر را تکمیل نمایید:
            </p>
            
            <ul className="list-disc mr-5 space-y-1">
              {!isProfileComplete && (
                <li>تکمیل اطلاعات پروفایل (نام، نام خانوادگی، آدرس و کد پستی)</li>
              )}
              
              {!isMobileVerified && (
                <li>تایید شماره موبایل (از طریق کد تایید)</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner; 