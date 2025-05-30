import { useDirection } from '../contexts/DirectionContext';

/**
 * Component Level Utilities
 * These hooks and functions depend on the DirectionContext
 */

/**
 * Returns a string with the appropriate class based on the current direction
 * Useful for conditionally applying RTL-specific styles
 * 
 * @param {string} baseClass - The base class name to use
 * @returns {string} - The combined class name including direction-specific suffix if needed
 */
export const useDirectionalClassName = (baseClass) => {
  const { direction } = useDirection();
  return `${baseClass} ${baseClass}-${direction}`;
};

/**
 * Returns the appropriate value based on the current direction
 * Useful for switching values based on RTL/LTR context
 * 
 * @param {any} rtlValue - The value to use when in RTL mode
 * @param {any} ltrValue - The value to use when in LTR mode
 * @returns {any} - The appropriate value based on current direction
 */
export const useDirectionalValue = (rtlValue, ltrValue) => {
  const { direction } = useDirection();
  return direction === 'rtl' ? rtlValue : ltrValue;
};

/**
 * Returns CSS transform for mirroring elements in RTL
 * 
 * @param {string} originalTransform - The original transform value (optional)
 * @returns {string} - The adjusted transform with scaleX(-1) added for RTL
 */
export const useMirrorTransform = (originalTransform = '') => {
  const { direction } = useDirection();
  if (direction === 'rtl') {
    return originalTransform ? `${originalTransform} scaleX(-1)` : 'scaleX(-1)';
  }
  return originalTransform;
};

/**
 * Swaps left/right properties for RTL
 * 
 * @param {Object} styles - The original styles object
 * @returns {Object} - Updated styles with left/right properties swapped for RTL
 */
export const useDirectionalStyles = (styles) => {
  const { direction } = useDirection();
  
  if (direction !== 'rtl') return styles;
  
  const result = { ...styles };
  
  // Swap padding
  if ('paddingLeft' in styles || 'paddingRight' in styles) {
    result.paddingLeft = styles.paddingRight;
    result.paddingRight = styles.paddingLeft;
  }
  
  // Swap margin
  if ('marginLeft' in styles || 'marginRight' in styles) {
    result.marginLeft = styles.marginRight;
    result.marginRight = styles.marginLeft;
  }
  
  // Swap position
  if ('left' in styles || 'right' in styles) {
    result.left = styles.right;
    result.right = styles.left;
  }
  
  return result;
}; 