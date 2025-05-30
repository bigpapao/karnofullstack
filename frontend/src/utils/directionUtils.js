/**
 * Direction and Language Utilities
 * Functions for handling document direction and language settings
 * These functions don't depend on the DirectionContext to avoid circular dependencies
 */

/**
 *
 * Sets both direction and language attributes on the HTML document
 * @param {string} direction - 'rtl' or 'ltr'
 * @param {string} language - Language code (e.g., 'fa', 'en')
 */
export const setDocumentDirectionAndLanguage = (direction, language) => {
  if (!direction || !language) return;
  
  // Set direction
  document.documentElement.setAttribute('dir', direction);
  document.body.setAttribute('dir', direction);
  
  // Set language
  document.documentElement.setAttribute('lang', language);
  
  // Update body classes
  if (direction === 'rtl') {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
    // Add a specific class to the document for Persian content when RTL
    document.body.classList.add('persian-content');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
    document.body.classList.remove('persian-content');
  }
};

/**
 * Determines if text appears to be Persian/Arabic based on character analysis
 * @param {string} text - Text to analyze
 * @returns {boolean} - True if text appears to be in Persian/Arabic
 */
export const isPersianText = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  // Persian/Arabic Unicode ranges
  const persianPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  // Count Persian/Arabic characters vs Latin characters
  let persianCharCount = 0;
  let latinCharCount = 0;
  
  for (let i = 0; i < text.length; i++) {
    if (persianPattern.test(text[i])) {
      persianCharCount++;
    } else if (/[a-zA-Z]/.test(text[i])) {
      latinCharCount++;
    }
  }
  
  // If text has more Persian/Arabic characters than Latin, consider it Persian
  return persianCharCount > latinCharCount;
};

/**
 * Gets appropriate direction based on text content
 * @param {string} text - Text to analyze
 * @returns {string} - 'rtl' for Persian/Arabic text, 'ltr' otherwise
 */
export const getTextDirection = (text) => {
  return isPersianText(text) ? 'rtl' : 'ltr';
};

/**
 * Gets appropriate language code based on text content
 * @param {string} text - Text to analyze
 * @returns {string} - 'fa' for Persian text, 'en' otherwise
 */
export const getTextLanguage = (text) => {
  return isPersianText(text) ? 'fa' : 'en';
};

/**
 * Applies appropriate direction style based on text content
 * @param {string} text - Text to analyze
 * @returns {object} - Style object with direction and textAlign properties
 */
export const getTextDirectionStyle = (text) => {
  const isRtl = isPersianText(text);
  return {
    direction: isRtl ? 'rtl' : 'ltr',
    textAlign: isRtl ? 'right' : 'left'
  };
};

/**
 * Returns the appropriate CSS class for text direction
 * @param {string} text - Text to analyze
 * @returns {string} - CSS class name ('rtl-text' or 'ltr-text')
 */
export const getTextDirectionClass = (text) => {
  return isPersianText(text) ? 'rtl-text' : 'ltr-text';
};

/**
 * Custom hook to get direction-aware values
 * 
 * @param {any} rtlValue - Value to use in RTL mode
 * @param {any} ltrValue - Value to use in LTR mode
 * @returns {any} - The appropriate value based on current direction
 */
export const useDirectionalValue = (rtlValue, ltrValue) => {
  // For Persian website, always use RTL value
  return rtlValue;
};

/**
 * Get direction-aware icon
 * 
 * @param {React.ComponentType} rtlIcon - Icon component to use in RTL mode
 * @param {React.ComponentType} ltrIcon - Icon component to use in LTR mode
 * @returns {React.ReactElement} - The appropriate icon component based on direction
 */
export const getDirectionalIcon = (rtlIcon, ltrIcon) => {
  // For Persian website, always use RTL icon
  return rtlIcon;
};

/**
 * Get direction-aware property value
 * 
 * @param {string} rtlProp - Property name to use in RTL mode
 * @param {string} ltrProp - Property name to use in LTR mode
 * @returns {string} - The appropriate property name based on direction
 */
export const getDirectionalProperty = (rtlProp, ltrProp) => {
  // For Persian website, always use RTL property
  return rtlProp;
}; 