import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../store/slices/authSlice';
import { isValidIranianMobile } from '../utils/phoneUtils';
import OTPVerificationModal from '../components/OTPVerificationModal';
import ProfileCompletionBanner from '../components/ProfileCompletionBanner';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, successMessage, authChecked } = useSelector((state) => state.auth);
  
  // State for profile form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });
  
  // State for OTP modal
  const [showOTPModal, setShowOTPModal] = useState(false);
  
  // State for form errors
  const [formErrors, setFormErrors] = useState({});
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for profile status
  const [profileStatus, setProfileStatus] = useState({
    isProfileComplete: false,
    isMobileVerified: false,
    missingFields: []
  });
  
  // Load user profile data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        province: user.province || '',
        postalCode: user.postalCode || '',
      });
      
      // Check profile completion
      setProfileStatus({
        isProfileComplete: user.isProfileComplete || false,
        isMobileVerified: user.mobileVerified || false,
        missingFields: []
      });
    } else {
      dispatch(getProfile());
    }
  }, [user, dispatch]);
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (authChecked && !user) {
      navigate('/', { replace: true });
    }
  }, [authChecked, user, navigate]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.firstName.trim()) errors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) errors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.address.trim()) errors.address = 'آدرس الزامی است';
    if (!formData.city.trim()) errors.city = 'شهر الزامی است';
    if (!formData.province.trim()) errors.province = 'استان الزامی است';
    if (!formData.postalCode.trim()) errors.postalCode = 'کد پستی الزامی است';
    
    // Phone validation
    if (!formData.phone) {
      errors.phone = 'شماره موبایل الزامی است';
    } else if (!isValidIranianMobile(formData.phone)) {
      errors.phone = 'فرمت شماره موبایل نامعتبر است';
    }
    
    // Postal code validation (10 digits)
    if (formData.postalCode && !/^\d{10}$/.test(formData.postalCode)) {
      errors.postalCode = 'کد پستی باید ۱۰ رقم باشد';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsSubmitting(false);
    } catch (err) {
      console.error('Update profile error:', err);
      setIsSubmitting(false);
    }
  };
  
  // Handle verify phone click
  const handleVerifyPhone = () => {
    setShowOTPModal(true);
  };
  
  // Close OTP modal
  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
  };
  
  // Handle successful verification
  const handleVerificationSuccess = () => {
    setShowOTPModal(false);
    // Update profile status
    setProfileStatus(prevStatus => ({
      ...prevStatus,
      isMobileVerified: true
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">حساب کاربری من</h1>
      
      {/* Profile completion banner */}
      {(!profileStatus.isProfileComplete || !profileStatus.isMobileVerified) && (
        <ProfileCompletionBanner 
          isProfileComplete={profileStatus.isProfileComplete}
          isMobileVerified={profileStatus.isMobileVerified}
        />
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Profile form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">اطلاعات شخصی</h2>
              
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  نام <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md ${
                    formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md ${
                    formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  شماره موبایل <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPhone}
                    className="mr-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={
                      !formData.phone || 
                      !isValidIranianMobile(formData.phone) || 
                      profileStatus.isMobileVerified
                    }
                  >
                    {profileStatus.isMobileVerified ? 'تایید شده' : 'تایید شماره'}
                  </button>
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
                {profileStatus.isMobileVerified && (
                  <p className="mt-1 text-sm text-green-600">شماره موبایل تایید شده است</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  ایمیل (اختیاری)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  dir="ltr"
                />
              </div>
            </div>
            
            {/* Address information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">آدرس</h2>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  آدرس <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  شهر <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md ${
                    formErrors.city ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                  استان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md ${
                    formErrors.province ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                />
                {formErrors.province && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.province}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  کد پستی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md ${
                    formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  dir="ltr"
                />
                {formErrors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ذخیره...
                </>
              ) : (
                'ذخیره اطلاعات'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* OTP verification modal */}
      <OTPVerificationModal
        show={showOTPModal}
        onClose={handleCloseOTPModal}
        phone={formData.phone}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default Profile;
