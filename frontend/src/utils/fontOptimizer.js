/**
 * Font Optimization Utilities
 * Handles font subsetting and optimization for Persian text
 */

// Persian character ranges for subsetting
const PERSIAN_RANGES = {
  basic: [0x0600, 0x06FF], // Basic Persian/Arabic
  extended: [0x0750, 0x077F], // Arabic Supplement
  additional: [0x08A0, 0x08FF], // Arabic Extended-A
  presentation: [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
  forms: [0xFE70, 0xFEFF], // Arabic Presentation Forms-B
};

// Common Persian characters and their Unicode points
const COMMON_PERSIAN_CHARS = [
  // Persian alphabet
  0x0627, 0x0628, 0x067E, 0x062A, 0x062B, 0x062C, 0x0686, 0x062D, 0x062E, 0x062F,
  0x0630, 0x0631, 0x0632, 0x0698, 0x0633, 0x0634, 0x0635, 0x0636, 0x0637, 0x0638,
  0x0639, 0x063A, 0x0641, 0x0642, 0x06A9, 0x06AF, 0x0644, 0x0645, 0x0646, 0x0648,
  0x0647, 0x06CC,
  // Persian numbers
  0x06F0, 0x06F1, 0x06F2, 0x06F3, 0x06F4, 0x06F5, 0x06F6, 0x06F7, 0x06F8, 0x06F9,
  // Common symbols and diacritics
  0x0640, 0x064B, 0x064C, 0x064D, 0x064E, 0x064F, 0x0650, 0x0651, 0x0652,
];

/**
 * Checks if a character is within any Persian Unicode range
 * @param {number} charCode - Unicode code point
 * @returns {boolean} - True if character is Persian
 */
export const isPersianChar = (charCode) => {
  return Object.values(PERSIAN_RANGES).some(([start, end]) => {
    return charCode >= start && charCode <= end;
  });
};

/**
 * Gets the subset of Persian characters used in a text
 * @param {string} text - Text to analyze
 * @returns {Set<number>} - Set of Unicode code points used
 */
export const getPersianCharacterSubset = (text) => {
  const usedChars = new Set();
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (isPersianChar(charCode)) {
      usedChars.add(charCode);
    }
  }
  
  // Add common Persian characters that might be needed
  COMMON_PERSIAN_CHARS.forEach(charCode => {
    usedChars.add(charCode);
  });
  
  return usedChars;
};

/**
 * Generates a font-face CSS rule with Unicode range subsetting
 * @param {string} fontFamily - Font family name
 * @param {string} fontUrl - URL to the font file
 * @param {Set<number>} unicodeRange - Set of Unicode code points to include
 * @param {object} options - Additional font-face options
 * @returns {string} - CSS @font-face rule
 */
export const generateSubsetFontFace = (fontFamily, fontUrl, unicodeRange, options = {}) => {
  const {
    fontWeight = 400,
    fontStyle = 'normal',
    fontDisplay = 'swap'
  } = options;
  
  // Convert Unicode points to ranges
  const ranges = Array.from(unicodeRange)
    .sort((a, b) => a - b)
    .map(point => `U+${point.toString(16).toUpperCase().padStart(4, '0')}`)
    .join(', ');
  
  return `
@font-face {
  font-family: '${fontFamily}';
  src: url('${fontUrl}') format('woff2');
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  font-display: ${fontDisplay};
  unicode-range: ${ranges};
}`.trim();
};

/**
 * Creates optimized font-face rules for Persian text
 * @param {string} text - Sample text to analyze
 * @param {string} fontFamily - Font family name
 * @param {string} fontUrl - Base URL for font files
 * @returns {string} - CSS rules for optimized font loading
 */
export const createOptimizedPersianFont = (text, fontFamily, fontUrl) => {
  const charSet = getPersianCharacterSubset(text);
  
  // Generate font-face rules for different weights
  const weights = [
    { weight: 400, suffix: 'Regular' },
    { weight: 500, suffix: 'Medium' },
    { weight: 700, suffix: 'Bold' }
  ];
  
  return weights.map(({ weight, suffix }) => {
    const weightUrl = fontUrl.replace(/Regular|Medium|Bold/, suffix);
    return generateSubsetFontFace(fontFamily, weightUrl, charSet, { fontWeight: weight });
  }).join('\n\n');
};

/**
 * Dynamically loads optimized Persian fonts based on content
 * @param {string} content - Text content to analyze
 */
export const loadOptimizedPersianFonts = (content) => {
  // Use requestIdleCallback or setTimeout to make this non-blocking
  const loadFonts = () => {
    try {
      const style = document.createElement('style');
      style.textContent = createOptimizedPersianFont(
        content,
        'Vazirmatn',
        'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2'
      );
      document.head.appendChild(style);
      console.log('Persian fonts loaded successfully');
    } catch (error) {
      console.error('Error loading optimized Persian fonts:', error);
      // Fallback to standard font loading
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap';
      document.head.appendChild(link);
      console.log('Fallback to standard font loading');
    }
  };
  
  // Use requestIdleCallback if available, otherwise setTimeout
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(loadFonts, { timeout: 2000 });
  } else {
    setTimeout(loadFonts, 0);
  }
}; 