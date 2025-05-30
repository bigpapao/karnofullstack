import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { isValidIranianMobile } from '../utils/phoneUtils';
import { getSessionId } from '../utils/sessionUtils';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    identifier: '', // Will hold either email or phone
    password: '',
  });
  
  // State to track if the input is email or phone
  const [identifierType, setIdentifierType] = useState('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Clear any error messages when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Show error message if login fails
  useEffect(() => {
    if (error) {
      setFormErrors({ general: error });
      setIsSubmitting(false);
    }
  }, [error]);
  
  // Update local submitting state based on global loading state
  useEffect(() => {
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [loading]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing the identifier field, detect if it's an email or phone
    if (name === 'identifier') {
      // Check if it contains @ symbol (likely an email)
      if (value.includes('@')) {
        setIdentifierType('email');
      } else {
        setIdentifierType('phone');
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear errors for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle remember me
  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };
  
  // Validate the form
  const validateForm = () => {
    const errors = {};
    
    // Validate identifier (email or phone)
    if (!formData.identifier) {
      errors.identifier = 'شماره موبایل یا ایمیل را وارد کنید';
    } else if (identifierType === 'phone' && !isValidIranianMobile(formData.identifier)) {
      errors.identifier = 'فرمت شماره موبایل نامعتبر است';
    } else if (identifierType === 'email' && !/\S+@\S+\.\S+/.test(formData.identifier)) {
      errors.identifier = 'فرمت ایمیل نامعتبر است';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'رمز عبور را وارد کنید';
    } else if (formData.password.length < 6) {
      errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
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
    
    // Set local submitting state
    setIsSubmitting(true);
    
    // Get session ID for cart merging
    const sessionId = getSessionId();
    
    // Prepare login data including session ID
    const loginData = {
      sessionId,
      rememberMe,
      password: formData.password
    };
    
    // Add either email or phone based on identifier type
    if (identifierType === 'email') {
      loginData.email = formData.identifier;
    } else {
      loginData.phone = formData.identifier;
    }

    try {
      // Clear any previous general error
      setFormErrors({});
      
      await dispatch(login(loginData)).unwrap();
      // If login successful, the useEffect for isAuthenticated will handle redirection
    } catch (err) {
      console.error('Login error:', err);
      // Display a generic error message regardless of specific error
      setFormErrors({ general: 'نام کاربری یا رمز عبور اشتباه است' });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          ورود به حساب کاربری
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {formErrors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{formErrors.general}</span>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium leading-6 text-gray-900">
              شماره موبایل یا ایمیل
            </label>
            <div className="mt-2">
              <input
                id="identifier"
                name="identifier"
                type={identifierType === 'email' ? 'email' : 'tel'}
                autoComplete={identifierType === 'email' ? 'email' : 'tel'}
                required
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                  formErrors.identifier ? 'ring-red-500' : 'ring-gray-300'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                value={formData.identifier}
                onChange={handleChange}
                placeholder={identifierType === 'email' ? 'example@email.com' : '09123456789'}
                dir="ltr"
              />
              {formErrors.identifier && (
                <p className="mt-2 text-sm text-red-600">{formErrors.identifier}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                رمز عبور
              </label>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  فراموشی رمز عبور؟
                </Link>
              </div>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                  formErrors.password ? 'ring-red-500' : 'ring-gray-300'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10`}
                value={formData.password}
                onChange={handleChange}
                dir="ltr"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                مرا به خاطر بسپار
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              ورود
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          حساب کاربری ندارید؟{' '}
          <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            ثبت نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
