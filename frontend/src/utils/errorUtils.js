/**
 * Error Utilities
 * 
 * A collection of utility functions for handling error messages and validation.
 */

/**
 * Extract error message from API response
 * @param {Object} error - The error object from axios or similar
 * @returns {string} - Human readable error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'خطای نامشخص رخ داده است.';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const data = error.response.data;
    
    if (data && data.message) {
      return data.message;
    } else if (data && data.error) {
      return data.error;
    } else if (error.response.status === 401) {
      return 'شما مجوز دسترسی به این بخش را ندارید. لطفاً وارد حساب کاربری خود شوید.';
    } else if (error.response.status === 403) {
      return 'شما مجوز انجام این عملیات را ندارید.';
    } else if (error.response.status === 404) {
      return 'اطلاعات درخواستی یافت نشد.';
    } else if (error.response.status === 422) {
      return 'اطلاعات وارد شده نامعتبر است.';
    } else if (error.response.status >= 500) {
      return 'خطایی در سرور رخ داده است. لطفاً بعداً دوباره تلاش کنید.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
  
  return 'خطای نامشخص رخ داده است.';
};

/**
 * Parse validation errors from API response into form errors
 * @param {Object} error - The API error response
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const parseValidationErrors = (error) => {
  const formErrors = {};
  
  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    
    if (Array.isArray(errors)) {
      // Handle array of error objects
      errors.forEach(err => {
        if (err.field && err.message) {
          formErrors[err.field] = err.message;
        }
      });
    } else if (typeof errors === 'object') {
      // Handle error object with field keys
      Object.keys(errors).forEach(field => {
        formErrors[field] = Array.isArray(errors[field]) 
          ? errors[field][0] 
          : errors[field];
      });
    }
  }
  
  // Add a general error if no specific field errors were found
  if (Object.keys(formErrors).length === 0) {
    formErrors.general = getErrorMessage(error);
  }
  
  return formErrors;
};

/**
 * Check if a field has specific validation errors
 * @param {Object} errors - The errors object
 * @param {string} fieldName - The field name to check
 * @returns {boolean} - True if the field has errors
 */
export const hasError = (errors, fieldName) => {
  return errors && errors[fieldName] ? true : false;
};

/**
 * Get field error message
 * @param {Object} errors - The errors object
 * @param {string} fieldName - The field name to get errors for
 * @returns {string|null} - The error message or null
 */
export const getFieldError = (errors, fieldName) => {
  return errors && errors[fieldName] ? errors[fieldName] : null;
}; 