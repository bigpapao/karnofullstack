/**
 * Persian Typography Utilities
 * Functions for handling Persian text, numbers, and typography
 */

/**
 * Converts English (Western) numbers to Persian numbers
 * @param {string|number} value - The value to convert
 * @returns {string} The value with Persian numerals
 */
export const toPersianNumbers = (value) => {
  if (value === null || value === undefined) return '';
  
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(value).replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

/**
 * Converts Persian numbers to English (Western) numbers
 * @param {string} value - The value with Persian numbers
 * @returns {string} The value with Western numerals
 */
export const toEnglishNumbers = (value) => {
  if (value === null || value === undefined) return '';
  
  return String(value)
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
};

/**
 * Formats price in Persian style with Toman currency
 * @param {number|string} amount - The amount to format
 * @param {boolean} includeCurrency - Whether to include the Toman currency suffix
 * @returns {string} Formatted price in Persian style
 */
export const formatPersianPrice = (amount, includeCurrency = true) => {
  if (amount === null || amount === undefined) return '';
  
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return '';
  
  // Format with thousands separators
  const formattedPrice = numericAmount.toLocaleString('fa-IR');
  
  // Add Toman suffix if requested
  return includeCurrency ? `${formattedPrice} تومان` : formattedPrice;
};

/**
 * Adds appropriate zero-width non-joiner characters to Persian text
 * Important for correct rendering of certain Persian letter combinations
 * @param {string} text - Persian text to process
 * @returns {string} Text with proper ZWNJ characters
 */
export const addPersianZwnj = (text) => {
  if (!text) return '';
  
  // Add ZWNJ after these Persian letters when followed by another letter
  return text
    .replace(/(\s|^)می(\s)/g, '$1می‌$2') // Add ZWNJ after "می" prefix
    .replace(/(\s|^)نمی(\s)/g, '$1نمی‌$2') // Add ZWNJ after "نمی" prefix
    .replace(/ی(\s)/g, 'ی‌$1') // Add ZWNJ after "ی" when followed by space
    .replace(/(\s)ها(\s|$)/g, '$1‌ها$2') // Add ZWNJ before plural "ها" suffix
    .replace(/(\s)های(\s|$)/g, '$1‌های$2') // Add ZWNJ before "های" suffix
    .replace(/(\s)تر(\s|$)/g, '$1‌تر$2') // Add ZWNJ before comparative "تر" suffix
    .replace(/(\s)ترین(\s|$)/g, '$1‌ترین$2'); // Add ZWNJ before superlative "ترین" suffix
};

/**
 * Gets the appropriate font class for a specific element type
 * @param {string} elementType - The type of element ('heading', 'body', 'button', etc.)
 * @returns {string} CSS class for the appropriate font
 */
export const getPersianFontClass = (elementType) => {
  switch (elementType.toLowerCase()) {
    case 'heading':
    case 'title':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return 'persian-heading';
    
    case 'body':
    case 'text':
    case 'p':
    case 'span':
    default:
      return 'persian-text';
  }
};

/**
 * Formats a telephone number in Persian style
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPersianPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Convert to string and remove non-numeric characters
  const digitsOnly = String(phoneNumber).replace(/\D/g, '');
  
  // Format Iranian mobile number
  if (digitsOnly.length === 11 && digitsOnly.startsWith('09')) {
    return toPersianNumbers(`${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`);
  }
  
  // Format landline with area code
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return toPersianNumbers(`${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7)}`);
  }
  
  // Default: just convert to Persian numbers with no formatting
  return toPersianNumbers(digitsOnly);
};

/**
 * Truncates Persian text and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncatePersianText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  
  // Truncate at a word boundary if possible
  let truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    truncated = truncated.slice(0, lastSpaceIndex);
  }
  
  return `${truncated}...`;
}; 