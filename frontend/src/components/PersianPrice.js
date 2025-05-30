import React from 'react';
import PropTypes from 'prop-types';
import { formatPersianPrice } from '../utils/typographyUtils';

/**
 * PersianPrice component
 * A component for displaying prices in Persian format
 * 
 * @param {object} props - Component props
 * @param {number|string} props.amount - The price amount
 * @param {boolean} props.includeCurrency - Whether to include the Toman currency suffix
 * @param {string} props.className - Additional CSS classes
 * @param {object} props.style - Additional inline styles
 * @returns {React.ReactElement} - The Persian price component
 */
const PersianPrice = ({
  amount,
  includeCurrency = true,
  className = '',
  style = {},
  ...rest
}) => {
  // Format the price
  const formattedPrice = formatPersianPrice(amount, includeCurrency);
  
  // Base classes
  const baseClasses = `persian-price ${className}`;
  
  // Base styles
  const baseStyle = {
    fontFamily: 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif',
    direction: 'rtl',
    display: 'inline-block',
    fontFeatureSettings: "'tnum'",
    ...style
  };
  
  return (
    <span className={baseClasses} style={baseStyle} {...rest}>
      {formattedPrice}
    </span>
  );
};

PersianPrice.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  includeCurrency: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

export default PersianPrice; 