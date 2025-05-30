/**
 * Address Validation Utilities
 * 
 * Functions for Iran-specific address validation, formatting, and suggestion handling
 */

import api from '../services/api';

/**
 * Debounce function to limit API calls
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate an address through the API
 * 
 * @param {Object} addressData - Address data to validate
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const validateAddress = async (addressData, onSuccess, onError) => {
  try {
    const response = await api.post('/addresses/validate', addressData);
    if (response.data && response.data.success) {
      onSuccess && onSuccess(response.data.data, response.data.warnings);
    } else {
      onError && onError(response.data.warnings || [{ message: 'خطا در اعتبارسنجی آدرس' }]);
    }
  } catch (error) {
    console.error('Address validation error:', error);
    onError && onError([{ message: 'خطا در ارتباط با سرور' }]);
  }
};

/**
 * Validate a single address field
 * 
 * @param {string} field - Field name
 * @param {string} value - Field value
 * @returns {Object} - Validation result with isValid and error
 */
export const validateAddressField = (field, value) => {
  const result = { isValid: true, error: null };
  
  switch (field) {
    case 'fullName':
      if (!value || value.trim().length < 3) {
        result.isValid = false;
        result.error = 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد';
      } else if (!/^[\u0600-\u06FF\s-]+$/.test(value.trim())) {
        result.isValid = false;
        result.error = 'نام و نام خانوادگی باید فقط شامل حروف فارسی، فاصله و خط تیره باشد';
      }
      break;
      
    case 'phoneNumber':
      if (!value || !/^09\d{9}$/.test(value.replace(/\s/g, ''))) {
        result.isValid = false;
        result.error = 'شماره موبایل باید با 09 شروع شده و ۱۱ رقم باشد';
      }
      break;
      
    case 'address':
      if (!value || value.trim().length < 5) {
        result.isValid = false;
        result.error = 'آدرس باید حداقل ۵ کاراکتر باشد';
      }
      break;
      
    case 'city':
      if (!value || value.trim().length < 2) {
        result.isValid = false;
        result.error = 'نام شهر الزامی است';
      }
      break;
      
    case 'state':
      if (!value) {
        result.isValid = false;
        result.error = 'استان الزامی است';
      }
      break;
      
    case 'zipCode':
      if (!value || !/^\d{10}$/.test(value.replace(/\s/g, ''))) {
        result.isValid = false;
        result.error = 'کد پستی باید ۱۰ رقم باشد';
      }
      break;
      
    default:
      break;
  }
  
  return result;
};

/**
 * Convert Persian numbers to English
 * 
 * @param {string} str - String with potential Persian numbers
 * @returns {string} - String with English numbers
 */
export const persianToEnglishNumber = (str) => {
  if (!str) return str;
  
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
  }
  
  return str;
};

/**
 * Format an address for display
 * 
 * @param {Object} address - Address object
 * @returns {string} - Formatted address string
 */
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  
  if (address.state) {
    parts.push(address.state);
  }
  
  if (address.city) {
    parts.push(address.city);
  }
  
  if (address.address) {
    parts.push(address.address);
  }
  
  if (address.zipCode) {
    parts.push(`کد پستی: ${address.zipCode}`);
  }
  
  return parts.join('، ');
};

/**
 * Check if address type should be shown
 * 
 * @param {Object} address - Address object
 * @returns {boolean} - Whether to show address type
 */
export const shouldShowAddressType = (address) => {
  return address && address.addressType && address.addressType !== 'default';
};

/**
 * Get label for address type
 * 
 * @param {Object} address - Address object
 * @returns {string} - Address type label
 */
export const getAddressTypeLabel = (address) => {
  if (!address || !address.addressType) return '';
  
  switch (address.addressType) {
    case 'home':
      return 'آدرس منزل';
    case 'work':
      return 'آدرس محل کار';
    case 'other':
      return 'آدرس دیگر';
    default:
      return '';
  }
};

/**
 * Check if address is eligible for same-day delivery
 * 
 * @param {Object} address - Address object
 * @returns {boolean} - Whether address is eligible for same-day delivery
 */
export const isSameDayDeliveryEligible = (address) => {
  if (!address || !address.city) return false;
  
  const eligibleCities = [
    'تهران',
    'کرج',
    'اصفهان',
    'شیراز',
    'مشهد',
    'تبریز'
  ];
  
  return eligibleCities.includes(address.city);
};

/**
 * Debounced version of validateAddress to use for real-time validation
 */
export const debouncedValidateAddress = debounce(validateAddress, 800);

/**
 * Convert English numbers to Persian
 * 
 * @param {string} str - String containing numbers
 * @returns {string} - String with Persian numbers
 */
export const convertToPersianNumbers = (str) => {
  if (!str) return '';
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, c => persianNumbers[parseInt(c)]);
};

// Validate postal code - Iranian postal code is 10 digits
export const isValidPostalCode = (postalCode) => {
  // Iranian postal code format: 10 digits without dash
  const postalCodePattern = /^\d{10}$/;
  return postalCodePattern.test(postalCode);
};

// Validate phone number
export const isValidPhoneNumber = (phoneNumber) => {
  // Iranian mobile phone format: 09XXXXXXXXX
  const phonePattern = /^09\d{9}$/;
  return phonePattern.test(phoneNumber);
};

// List of Iranian provinces
export const iranianProvinces = [
  'تهران',
  'اصفهان',
  'خراسان رضوی',
  'فارس',
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'اردبیل',
  'البرز',
  'ایلام',
  'بوشهر',
  'چهارمحال و بختیاری',
  'خراسان جنوبی',
  'خراسان شمالی',
  'خوزستان',
  'زنجان',
  'سمنان',
  'سیستان و بلوچستان',
  'قزوین',
  'قم',
  'کردستان',
  'کرمان',
  'کرمانشاه',
  'کهگیلویه و بویراحمد',
  'گلستان',
  'گیلان',
  'لرستان',
  'مازندران',
  'مرکزی',
  'هرمزگان',
  'همدان',
  'یزد'
];

// Address types
export const addressTypes = [
  { value: 'home', label: 'منزل' },
  { value: 'work', label: 'محل کار' },
  { value: 'other', label: 'سایر' }
];

// Export address validation utilities
const addressValidation = {
  formatAddress,
  validateAddress,
  getAddressTypeLabel,
  isValidPostalCode,
  isValidPhoneNumber,
  shouldShowAddressType,
  iranianProvinces,
  addressTypes,
};

export default addressValidation;