/**
 * Persian Language Utilities
 * 
 * This file contains utility functions for Persian language support, 
 * including conversion of numbers to Persian digits, formatting currency, 
 * and date formatting according to Persian calendar.
 */

// Persian digits mapping
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Convert English digits to Persian digits
 * @param {number|string} value - The input number or string 
 * @returns {string} - String with Persian digits
 */
export const toPersianNumber = (value) => {
  if (value === null || value === undefined) return '';
  
  return value
    .toString()
    .replace(/\d/g, x => persianDigits[x]);
};

/**
 * Format a number as Persian currency (Rial/Toman)
 * @param {number} amount - The amount in Rials
 * @param {boolean} asToman - Whether to convert to Tomans (divide by 10)
 * @returns {string} - Formatted currency string
 */
export const toPersianCurrency = (amount, asToman = false) => {
  if (amount === null || amount === undefined) return '';
  
  // If needed, convert from Rial to Toman
  const value = asToman ? Math.floor(amount / 10) : amount;
  
  // Format with commas
  const formattedAmount = value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Convert to Persian digits
  const persianAmount = toPersianNumber(formattedAmount);
  
  // Add currency suffix
  return `${persianAmount} ${asToman ? 'تومان' : 'ریال'}`;
};

/**
 * Convert a number to words in Persian
 * @param {number} num - The number to convert
 * @returns {string} - The number in Persian words
 */
export const numberToPersianWords = (num) => {
  if (num === 0) return 'صفر';
  
  const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  
  const groups = ['', ' هزار', ' میلیون', ' میلیارد'];
  
  if (num < 0) return `منفی ${numberToPersianWords(Math.abs(num))}`;
  
  if (num < 10) return units[num];
  
  if (num < 20) return teens[num - 10];
  
  if (num < 100) {
    const unit = num % 10;
    const ten = Math.floor(num / 10);
    return unit ? `${tens[ten]} و ${units[unit]}` : tens[ten];
  }
  
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return remainder ? `${hundreds[hundred]} و ${numberToPersianWords(remainder)}` : hundreds[hundred];
  }
  
  // Handle larger numbers by breaking into groups of 3 digits
  let result = '';
  let groupIndex = 0;
  let tempNum = num;
  
  while (tempNum > 0) {
    const threeDigits = tempNum % 1000;
    if (threeDigits > 0) {
      const prefix = result ? ' و ' : '';
      result = `${numberToPersianWords(threeDigits)}${groups[groupIndex]}${prefix}${result}`;
    }
    tempNum = Math.floor(tempNum / 1000);
    groupIndex++;
  }
  
  return result;
};

/**
 * Convert Gregorian date to Persian (Jalali) date
 * @param {Date|string} date - JavaScript Date object or date string
 * @param {string} format - Output format (defaults to 'YYYY/MM/DD')
 * @returns {string} - Formatted Persian date
 */
export const toPersianDate = (date, format = 'YYYY/MM/DD') => {
  // This is a simplified conversion for demo purposes
  // In a real app, you would use a library like jalali-moment or jalaali-js
  
  const d = date instanceof Date ? date : new Date(date);
  
  // Add 0 prefix to month and day if needed
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear() - 621; // Rough approximation - NOT ACCURATE
  
  // Format the date according to the requested format
  let formattedDate = format
    .replace('YYYY', toPersianNumber(year))
    .replace('MM', toPersianNumber(month < 10 ? `0${month}` : month))
    .replace('DD', toPersianNumber(day < 10 ? `0${day}` : day));
  
  return formattedDate;
};

/**
 * Format time in Persian
 * @param {Date|string} date - JavaScript Date object or date string
 * @param {boolean} showSeconds - Whether to include seconds
 * @returns {string} - Formatted Persian time (HH:MM:SS or HH:MM)
 */
export const toPersianTime = (date, showSeconds = false) => {
  const d = date instanceof Date ? date : new Date(date);
  
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  const formattedHours = toPersianNumber(hours < 10 ? `0${hours}` : hours);
  const formattedMinutes = toPersianNumber(minutes < 10 ? `0${minutes}` : minutes);
  
  if (showSeconds) {
    const formattedSeconds = toPersianNumber(seconds < 10 ? `0${seconds}` : seconds);
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  return `${formattedHours}:${formattedMinutes}`;
};

/**
 * Format a date range in Persian
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} - Formatted date range in Persian
 */
export const toPersianDateRange = (startDate, endDate) => {
  const start = toPersianDate(startDate);
  const end = toPersianDate(endDate);
  
  return `${start} تا ${end}`;
};

/**
 * Convert numbers in a text to Persian digits
 * @param {string} text - Text containing numbers
 * @returns {string} - Text with Persian digits
 */
export const convertNumbersInText = (text) => {
  if (!text) return '';
  
  return text.replace(/\d/g, x => persianDigits[x]);
};

/**
 * Add Persian ordinal suffix to a number
 * @param {number} num - The number
 * @returns {string} - Number with Persian ordinal suffix (e.g., اول، دوم، سوم)
 */
export const toPersianOrdinal = (num) => {
  if (num <= 0) return '';
  
  // Special cases for 1-3
  if (num === 1) return 'اول';
  if (num === 2) return 'دوم';
  if (num === 3) return 'سوم';
  
  // General case: add 'م' suffix
  return `${toPersianNumber(num)}م`;
};

/**
 * Creates a validator for Persian phone numbers
 * @returns {Function} A validation function for Persian phone numbers
 */
export const persianPhoneValidator = () => {
  return (value) => {
    // Persian phone number format: starts with 09 followed by 9 digits
    const regex = /^09\d{9}$/;
    if (!value || regex.test(value)) {
      return true;
    }
    return 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد';
  };
};

/**
 * Creates a validator for Persian postal codes
 * @returns {Function} A validation function for Persian postal codes
 */
export const persianPostalCodeValidator = () => {
  return (value) => {
    // Persian postal code format: 10 digits
    const regex = /^\d{10}$/;
    if (!value || regex.test(value)) {
      return true;
    }
    return 'کد پستی باید ۱۰ رقم باشد';
  };
};

/**
 * Direction helper for creating consistent RTL layouts
 */
export const rtlDirection = {
  dir: 'rtl',
  textAlign: 'right',
};

/**
 * A list of Persian months
 */
export const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
]; 