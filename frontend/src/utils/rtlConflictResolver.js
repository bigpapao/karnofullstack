/**
 * RTL Conflict Resolver
 * 
 * Utilities to help identify and resolve conflicts between RTL styles
 * and existing components or styles.
 */

import React, { useEffect } from 'react';
import { useDirection } from '../contexts/DirectionContext';

/**
 * Hook to log potential RTL conflict warnings in development mode
 * 
 * @param {string} componentName - The name of the component being checked
 * @param {Object} props - The component props to check for potential conflicts
 * @param {Array} conflictingProps - Array of prop names that may conflict with RTL layout
 * @returns {boolean} - Whether any conflicts were detected
 */
export const useRTLConflictDetector = (componentName, props, conflictingProps = []) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  useEffect(() => {
    // Only run conflict detection in development mode
    if (process.env.NODE_ENV !== 'development' || !isRTL) return;
    
    const detectedConflicts = [];
    
    // Common potentially conflicting props
    const standardConflictProps = [
      'left', 'right', 'float', 'marginLeft', 'marginRight',
      'paddingLeft', 'paddingRight', 'textAlign',
      'transformOrigin', 'transform'
    ];
    
    // Combine standard and custom conflicting props
    const allConflictProps = [...standardConflictProps, ...conflictingProps];
    
    // Check for potentially conflicting props
    allConflictProps.forEach(prop => {
      if (props[prop] !== undefined) {
        detectedConflicts.push(prop);
      }
    });
    
    // Check for inline styles that might conflict
    if (props.style) {
      Object.keys(props.style).forEach(styleProp => {
        if (allConflictProps.includes(styleProp)) {
          detectedConflicts.push(`style.${styleProp}`);
        }
      });
    }
    
    // Log warnings for detected conflicts
    if (detectedConflicts.length > 0) {
      console.warn(
        `[RTL Conflict Warning] Component "${componentName}" has potentially conflicting props in RTL mode:`,
        detectedConflicts.join(', '),
        '\nConsider using directional utilities like "useDirectionalValue" or "getDirectionalProperty" instead.'
      );
    }
    
    return () => {};
  }, [componentName, props, conflictingProps, isRTL]);
  
  return isRTL;
};

/**
 * Function to fix common style conflicts in RTL mode
 * 
 * @param {Object} styles - The style object to check and fix
 * @param {boolean} isRTL - Whether the current direction is RTL
 * @returns {Object} - The fixed style object
 */
export const fixRTLStyleConflicts = (styles, isRTL) => {
  if (!isRTL || !styles) return styles;
  
  const fixedStyles = { ...styles };
  
  // Fix directional properties
  if ('left' in fixedStyles && !('right' in fixedStyles)) {
    fixedStyles.right = fixedStyles.left;
    delete fixedStyles.left;
  }
  
  if ('right' in fixedStyles && !('left' in fixedStyles)) {
    fixedStyles.left = fixedStyles.right;
    delete fixedStyles.right;
  }
  
  // Fix margin properties
  if ('marginLeft' in fixedStyles && !('marginRight' in fixedStyles)) {
    fixedStyles.marginRight = fixedStyles.marginLeft;
    delete fixedStyles.marginLeft;
  }
  
  if ('marginRight' in fixedStyles && !('marginLeft' in fixedStyles)) {
    fixedStyles.marginLeft = fixedStyles.marginRight;
    delete fixedStyles.marginRight;
  }
  
  // Fix padding properties
  if ('paddingLeft' in fixedStyles && !('paddingRight' in fixedStyles)) {
    fixedStyles.paddingRight = fixedStyles.paddingLeft;
    delete fixedStyles.paddingLeft;
  }
  
  if ('paddingRight' in fixedStyles && !('paddingLeft' in fixedStyles)) {
    fixedStyles.paddingLeft = fixedStyles.paddingRight;
    delete fixedStyles.paddingRight;
  }
  
  // Fix transform properties with translations
  if (fixedStyles.transform && typeof fixedStyles.transform === 'string') {
    fixedStyles.transform = fixedStyles.transform
      .replace(/translateX\(([^)]+)\)/g, (match, value) => {
        // Negate values for translateX
        if (value.includes('-')) {
          return `translateX(${value.replace('-', '')})`;
        } else if (value !== '0' && value !== '0px') {
          return `translateX(-${value})`;
        }
        return match;
      });
  }
  
  // Fix text alignment
  if (fixedStyles.textAlign === 'left') {
    fixedStyles.textAlign = 'right';
  } else if (fixedStyles.textAlign === 'right') {
    fixedStyles.textAlign = 'left';
  }
  
  return fixedStyles;
};

/**
 * Higher-order component to add RTL conflict detection
 * 
 * @param {React.Component} Component - The component to wrap
 * @param {string} displayName - Display name for the component (for debugging)
 * @param {Array} conflictingProps - Custom props to check for conflicts
 * @returns {React.Component} - The wrapped component with conflict detection
 */
export const withRTLConflictDetection = (Component, displayName, conflictingProps = []) => {
  const WrappedComponent = (props) => {
    useRTLConflictDetector(displayName || Component.displayName || 'Component', props, conflictingProps);
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `WithRTLConflictDetection(${displayName || Component.displayName || 'Component'})`;
  return WrappedComponent;
};

/**
 * Apply RTL-safe styles to an element
 * This is useful for third-party components that don't handle RTL well
 * 
 * @param {Object} props - The props object
 * @param {boolean} isRTL - Whether RTL mode is active
 * @returns {Object} - Fixed props object
 */
export const makePropsRTLSafe = (props, isRTL) => {
  if (!isRTL) return props;
  
  const safeProps = { ...props };
  
  // Fix style props if they exist
  if (safeProps.style) {
    safeProps.style = fixRTLStyleConflicts(safeProps.style, isRTL);
  }
  
  // Replace any direct position props
  if ('left' in safeProps && !('right' in safeProps)) {
    safeProps.right = safeProps.left;
    delete safeProps.left;
  }
  
  if ('right' in safeProps && !('left' in safeProps)) {
    safeProps.left = safeProps.right;
    delete safeProps.right;
  }
  
  return safeProps;
};

/**
 * Hook to create RTL-safe inline styles
 * 
 * @param {Object} styles - The original styles object
 * @returns {Object} - An RTL-safe styles object
 */
export const useRTLSafeStyles = (styles) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  return fixRTLStyleConflicts(styles, isRTL);
};

/**
 * Scan a component's children for potential RTL conflicts
 * Useful for container components that render arbitrary children
 * 
 * @param {React.ReactNode} children - Children to analyze
 * @param {boolean} isRTL - Whether RTL mode is active
 * @returns {Object} - Stats about the scan
 */
export const scanChildrenForRTLConflicts = (children, isRTL) => {
  if (!isRTL || process.env.NODE_ENV !== 'development') {
    return { conflicts: 0, analyzed: 0 };
  }
  
  let conflicts = 0;
  let analyzed = 0;
  
  // React utilities to traverse and analyze the children tree
  const analyzeChild = (child) => {
    if (!child || typeof child !== 'object') return;
    
    analyzed++;
    
    // Check props for common conflicts
    const props = child.props || {};
    const problematicProps = [
      'left', 'right', 'float', 'marginLeft', 'marginRight',
      'paddingLeft', 'paddingRight', 'textAlign'
    ];
    
    problematicProps.forEach(prop => {
      if (props[prop] !== undefined) conflicts++;
    });
    
    // Check inline styles
    if (props.style) {
      Object.keys(props.style).forEach(styleProp => {
        if (problematicProps.includes(styleProp)) conflicts++;
      });
    }
    
    // Recursively check children if they exist
    if (props.children) {
      React.Children.forEach(props.children, analyzeChild);
    }
  };
  
  React.Children.forEach(children, analyzeChild);
  
  return { conflicts, analyzed };
};

export default {
  useRTLConflictDetector,
  fixRTLStyleConflicts,
  withRTLConflictDetection,
  makePropsRTLSafe,
  useRTLSafeStyles,
  scanChildrenForRTLConflicts
}; 