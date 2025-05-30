/**
 * Phone number utility functions for Iranian mobile numbers
 */

/**
 * Validates if the given phone number is a valid Iranian mobile number
 * Valid formats: 09123456789, 9123456789, +989123456789, 00989123456789
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export const isValidIranianMobile = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digit characters and spaces/dashes
  const cleanPhone = phone.toString().replace(/[\s\-\D]/g, '');
  
  // Check different valid formats
  if (/^09\d{9}$/.test(cleanPhone)) {
    return true; // Format: 09XXXXXXXXX
  }
  
  if (/^9\d{9}$/.test(cleanPhone)) {
    return true; // Format: 9XXXXXXXXX
  }
  
  if (/^989\d{9}$/.test(cleanPhone)) {
    return true; // Format: 989XXXXXXXXX (without + or 00)
  }
  
  if (/^00989\d{9}$/.test(cleanPhone)) {
    return true; // Format: 00989XXXXXXXXX
  }
  
  // Check for international format with +
  if (/^[+]989\d{9}$/.test(phone)) {
    return true; // Format: +989XXXXXXXXX
  }
  
  return false;
};

/**
 * Normalizes an Iranian phone number to E.164 format for storage and API requests
 * 
 * @param {string} phone - Phone number to normalize
 * @returns {string|null} Normalized phone number in E.164 format (+989XXXXXXXX) or null if invalid
 */
export const normalizePhoneNumber = (phone) => {
  if (!isValidIranianMobile(phone)) return null;
  
  // Remove all non-digit characters
  let normalizedPhone = phone.toString().replace(/\D/g, '');
  
  // If starts with 00, remove it
  if (normalizedPhone.startsWith('00')) {
    normalizedPhone = normalizedPhone.substring(2);
  }
  
  // Remove country code (98) if present, then add it back in correct format
  if (normalizedPhone.startsWith('98')) {
    normalizedPhone = `+${normalizedPhone}`;
  } 
  // If starts with 0, remove it and add +98
  else if (normalizedPhone.startsWith('0') && normalizedPhone.length === 11) {
    normalizedPhone = `+98${normalizedPhone.substring(1)}`;
  }
  // If just starts with 9 and has 10 digits
  else if (normalizedPhone.startsWith('9') && normalizedPhone.length === 10) {
    normalizedPhone = `+98${normalizedPhone}`;
  }
  
  return normalizedPhone;
};

/**
 * Formats a phone number in the standard Iranian format for display
 * 
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number (e.g., 0912-345-6789)
 */
export const formatIranianMobile = (phone) => {
  if (!isValidIranianMobile(phone)) return phone;
  
  // Remove all non-digit characters
  let digitsOnly = phone.toString().replace(/\D/g, '');
  
  // Convert from international format if needed
  if (digitsOnly.startsWith('98') && digitsOnly.length === 12) {
    digitsOnly = `0${digitsOnly.substring(2)}`;
  } else if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
    digitsOnly = `0${digitsOnly}`;
  } else if (!digitsOnly.startsWith('0')) {
    digitsOnly = `0${digitsOnly}`;
  }
  
  // Format as 0XXX-XXX-XXXX
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `${digitsOnly.substring(0, 4)}-${digitsOnly.substring(4, 7)}-${digitsOnly.substring(7)}`;
  }
  
  return phone;
};

// Create an object for the default export
const phoneUtils = {
  isValidIranianMobile,
  formatIranianMobile,
  normalizePhoneNumber
};

// Export the object
export default phoneUtils; 