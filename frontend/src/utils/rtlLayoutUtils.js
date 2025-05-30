/**
 * RTL Layout Utilities
 * 
 * This file contains utility functions specifically for handling RTL layout
 * considerations in grid and flexbox layouts.
 */

import { useDirection } from '../contexts/DirectionContext';

/**
 * Hook to get the correct grid order for RTL layouts
 * 
 * In RTL layouts, we often need to reverse the order of grid items.
 * This hook returns the appropriate order value for a grid item based on the current direction.
 * 
 * @param {number} rtlOrder - The order to use in RTL mode
 * @param {number} ltrOrder - The order to use in LTR mode
 * @returns {number} - The correct order value
 */
export const useGridOrder = (rtlOrder, ltrOrder) => {
  const { direction } = useDirection();
  return direction === 'rtl' ? rtlOrder : ltrOrder;
};

/**
 * Hook to get correct Material UI Grid props for RTL layouts
 * 
 * @param {Object} props - The base props for the Grid component
 * @param {boolean} reverseInRTL - Whether to reverse the grid order in RTL mode
 * @returns {Object} - Updated props with RTL-specific values
 */
export const useRTLGridProps = (props = {}, reverseInRTL = true) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  // If we don't need to reverse order in RTL, just return original props
  if (!reverseInRTL || !isRTL) return props;
  
  // Create a new props object with RTL-specific values
  const rtlProps = { ...props };
  
  // Determine if we need to modify the order
  if (isRTL && reverseInRTL) {
    // Add order property to reverse direction in RTL
    rtlProps.order = {
      ...(props.order || {}),
      xs: 'reverse',
    };
  }
  
  return rtlProps;
};

/**
 * Get CSS grid template areas for RTL layouts
 * 
 * @param {string[][]} ltrAreaTemplate - LTR grid template areas
 * @returns {string[][]} - RTL adjusted grid template areas
 */
export const getRTLGridTemplateAreas = (ltrAreaTemplate) => {
  const { direction } = useDirection();
  
  if (direction !== 'rtl') return ltrAreaTemplate;
  
  // Reverse each row for RTL
  return ltrAreaTemplate.map(row => [...row].reverse());
};

/**
 * Get flexbox direction based on current direction
 * 
 * @param {string} ltrDirection - Flexbox direction in LTR mode ('row', 'column', etc.)
 * @returns {string} - The appropriate flexbox direction
 */
export const getFlexDirection = (ltrDirection = 'row') => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  // If not in RTL or not row-based, return original
  if (!isRTL || !ltrDirection.includes('row')) return ltrDirection;
  
  // Handle row directions for RTL
  switch (ltrDirection) {
    case 'row':
      return 'row-reverse';
    case 'row-reverse':
      return 'row';
    default:
      return ltrDirection;
  }
};

/**
 * Hook to get flexbox properties adjusted for RTL
 * 
 * @param {Object} props - Original flex container props
 * @returns {Object} - RTL-adjusted flex container props
 */
export const useRTLFlexProps = (props = {}) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  if (!isRTL) return props;
  
  const rtlProps = { ...props };
  
  // Adjust flex direction if needed
  if (props.flexDirection && props.flexDirection.includes('row')) {
    rtlProps.flexDirection = getFlexDirection(props.flexDirection);
  }
  
  // Adjust justifyContent if needed
  if (props.justifyContent) {
    switch (props.justifyContent) {
      case 'flex-start':
        rtlProps.justifyContent = 'flex-end';
        break;
      case 'flex-end':
        rtlProps.justifyContent = 'flex-start';
        break;
      default:
        // For 'center', 'space-between', etc., leave as is
        break;
    }
  }
  
  return rtlProps;
}; 