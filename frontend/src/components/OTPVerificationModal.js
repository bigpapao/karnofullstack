import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../services/api';

/**
 * OTP Verification Modal Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the modal
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {string} props.phone - Phone number to verify
 * @param {Function} props.onSuccess - Function to call when verification is successful
 */
const OTPVerificationModal = ({ show, onClose, phone, onSuccess }) => {
  const [otpCode, setOtpCode] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  
  // Array of refs for OTP input fields
  const inputRefs = useRef([]);
  
  // Initialize refs for OTP inputs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5);
  }, []);
  
  // Focus first input when modal opens
  useEffect(() => {
    if (show && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
    }
  }, [show]);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (show) {
      setOtpCode(['', '', '', '', '']);
      setError('');
      setSuccess('');
      // Send OTP code when modal opens
      handleSendOTP();
    }
  }, [show, phone]);
  
  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Handle input change for OTP code
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // If pasting multiple digits, distribute them
      const digits = value.split('').slice(0, 5);
      const newOtpCode = [...otpCode];
      
      digits.forEach((digit, i) => {
        if (index + i < 5) {
          newOtpCode[index + i] = digit;
        }
      });
      
      setOtpCode(newOtpCode);
      
      // Focus on next empty field or last field if all filled
      const nextIndex = Math.min(index + digits.length, 4);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    } else {
      // Single digit input
      const newOtpCode = [...otpCode];
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);
      
      // Auto focus next input if digit entered
      if (value && index < 4) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  
  // Handle key press for OTP input
  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Send OTP code to user's phone
  const handleSendOTP = async () => {
    if (!phone) {
      setError('شماره موبایل نامعتبر است');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setIsResending(true);
    
    try {
      const response = await api.post('/user/send-otp');
      
      // Start countdown for resend button (2 minutes)
      setCountdown(120);
      
      // Show success message
      setSuccess('کد تایید ارسال شد');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Send OTP error:', error);
      
      // Get error message
      const errorMessage = error.response?.data?.message || 'خطا در ارسال کد تایید';
      setError(errorMessage);
      
      // If rate limited, set countdown
      if (error.response?.data?.timeLeft) {
        setCountdown(error.response.data.timeLeft);
      }
    } finally {
      setIsLoading(false);
      setIsResending(false);
    }
  };
  
  // Verify OTP code
  const handleVerify = async () => {
    // Check if OTP code is complete
    const code = otpCode.join('');
    if (code.length !== 5) {
      setError('لطفا کد ۵ رقمی را وارد کنید');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/user/verify-otp', { code });
      
      // Show success message
      setSuccess('شماره موبایل با موفقیت تایید شد');
      
      // Call onSuccess callback
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      console.error('Verify OTP error:', error);
      
      // Get error message
      const errorMessage = error.response?.data?.message || 'کد تایید نامعتبر است';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Modal backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Skip rendering if not shown
  if (!show) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">تایید شماره موبایل</h2>
          <p className="text-gray-600 mt-1">
            کد تایید ۵ رقمی به شماره {phone} ارسال شد.
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        {/* OTP input boxes */}
        <div className="flex justify-center gap-2 my-6 dir-ltr">
          {otpCode.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={5} // Allow pasting full code
              className="w-12 h-12 border-2 rounded-md text-center text-lg font-bold border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>
        
        {/* Resend code countdown */}
        <div className="text-center text-sm text-gray-600 mb-4">
          {countdown > 0 ? (
            <p>
              ارسال مجدد کد تا {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60} دیگر
            </p>
          ) : (
            <button
              onClick={handleSendOTP}
              disabled={isResending}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isResending ? 'در حال ارسال...' : 'ارسال مجدد کد'}
            </button>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3 space-x-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </button>
          <button
            onClick={handleVerify}
            disabled={isLoading || otpCode.join('').length !== 5}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading || otpCode.join('').length !== 5 ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال بررسی...
              </span>
            ) : (
              'تایید'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal; 