import React from 'react';
import PropTypes from 'prop-types';
import { toPersianNumbers, addPersianZwnj, getPersianFontClass } from '../utils/typographyUtils';

/**
 * PersianTypography component
 * A component for displaying Persian text with proper styling and number conversion
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - The text content
 * @param {string} props.variant - Typography variant (heading, subheading, body, caption)
 * @param {string} props.component - HTML element to render (h1, h2, p, etc.) or React component
 * @param {boolean} props.convertNumbers - Whether to convert numbers to Persian digits
 * @param {boolean} props.addZwnj - Whether to add zero-width non-joiners for proper Persian display
 * @param {string} props.className - Additional CSS class names
 * @param {object} props.style - Additional inline styles
 * @returns {React.ReactElement} - The Persian typography component
 */
const PersianTypography = ({
  children,
  variant = 'body',
  component: Component = 'p',
  convertNumbers = true,
  addZwnj = true,
  className = '',
  style = {},
  ...rest
}) => {
  // Determine font class based on variant
  const fontClass = getPersianFontClass(variant);
  
  // Process text content if it's a string
  let processedContent = children;
  
  if (typeof children === 'string') {
    // Apply text processing functions
    if (addZwnj) {
      processedContent = addPersianZwnj(processedContent);
    }
    
    if (convertNumbers) {
      processedContent = toPersianNumbers(processedContent);
    }
  }
  
  // Base class names
  const baseClassName = `${fontClass} ${className}`;
  
  // Generate style based on variant
  const variantStyle = {};
  
  switch(variant) {
    case 'h1':
      variantStyle.fontSize = '2.5rem';
      variantStyle.fontWeight = 700;
      variantStyle.lineHeight = 1.3;
      break;
    case 'h2':
      variantStyle.fontSize = '2rem';
      variantStyle.fontWeight = 700;
      variantStyle.lineHeight = 1.3;
      break;
    case 'h3':
      variantStyle.fontSize = '1.75rem';
      variantStyle.fontWeight = 600;
      variantStyle.lineHeight = 1.4;
      break;
    case 'h4':
      variantStyle.fontSize = '1.5rem';
      variantStyle.fontWeight = 600;
      variantStyle.lineHeight = 1.4;
      break;
    case 'h5':
      variantStyle.fontSize = '1.25rem';
      variantStyle.fontWeight = 600;
      variantStyle.lineHeight = 1.5;
      break;
    case 'h6':
      variantStyle.fontSize = '1.125rem';
      variantStyle.fontWeight = 600;
      variantStyle.lineHeight = 1.5;
      break;
    case 'subtitle':
      variantStyle.fontSize = '1.125rem';
      variantStyle.fontWeight = 500;
      variantStyle.lineHeight = 1.6;
      break;
    case 'body':
      variantStyle.fontSize = '1rem';
      variantStyle.fontWeight = 400;
      variantStyle.lineHeight = 1.6;
      break;
    case 'caption':
      variantStyle.fontSize = '0.875rem';
      variantStyle.fontWeight = 400;
      variantStyle.lineHeight = 1.6;
      break;
    default:
      // No additional styles for other variants
  }
  
  // Merge styles
  const combinedStyle = { ...variantStyle, ...style };
  
  return (
    <Component className={baseClassName} style={combinedStyle} {...rest}>
      {processedContent}
    </Component>
  );
};

PersianTypography.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle', 'body', 'caption']),
  component: PropTypes.elementType,
  convertNumbers: PropTypes.bool,
  addZwnj: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default PersianTypography; 