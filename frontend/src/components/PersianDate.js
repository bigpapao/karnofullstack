import React from 'react';
import PropTypes from 'prop-types';
import { toPersianNumbers } from '../utils/typographyUtils';

/**
 * Helper function to convert Gregorian date to Jalali (Persian) date
 * @param {Date} date - Gregorian date
 * @returns {Object} - Jalali date object with year, month, and day properties
 */
const toJalali = (date) => {
  // Ensure input is a valid Date object
  const gDate = new Date(date);
  if (isNaN(gDate.getTime())) {
    console.error('Invalid date provided to toJalali');
    return { year: 0, month: 0, day: 0 };
  }

  const gy = gDate.getFullYear();
  const gm = gDate.getMonth() + 1;
  const gd = gDate.getDate();

  // Convert to Jalali
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  // Check for leap year
  const gy2 = (gm > 2) ? gy + 1 : gy;
  let days = 355666 + (365 * gy) + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + 
             parseInt((gy2 + 399) / 400);

  for (let i = 0; i < gm - 1; ++i) {
    days += g_days_in_month[i];
  }

  if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
    days += 1;
  }

  days += gd;

  let jy = -1595 + (33 * parseInt(days / 12053));
  days %= 12053;
  jy += 4 * parseInt(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += parseInt((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));

  return { year: jy, month: jm, day: jd };
};

/**
 * Get Persian month name
 * @param {number} month - Month number (1-12)
 * @returns {string} - Persian month name
 */
const getPersianMonth = (month) => {
  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  return months[month - 1] || '';
};

/**
 * Format Jalali date based on format string
 * @param {Object} jalaliDate - Jalali date object
 * @param {string} format - Format string
 * @returns {string} - Formatted date string
 */
const formatJalaliDate = (jalaliDate, format) => {
  const { year, month, day } = jalaliDate;
  
  return format
    .replace('YYYY', toPersianNumbers(year))
    .replace('MM', toPersianNumbers(month.toString().padStart(2, '0')))
    .replace('M', toPersianNumbers(month))
    .replace('DD', toPersianNumbers(day.toString().padStart(2, '0')))
    .replace('D', toPersianNumbers(day))
    .replace('MMMM', getPersianMonth(month));
};

/**
 * PersianDate component
 * A component for displaying dates in Persian (Jalali) format
 * 
 * @param {object} props - Component props
 * @param {Date|string} props.date - The date to display (Date object or ISO string)
 * @param {string} props.format - Date format (YYYY: year, MM: month with leading zero, M: month, DD: day with leading zero, D: day, MMMM: month name)
 * @param {string} props.className - Additional CSS classes
 * @param {object} props.style - Additional inline styles
 * @returns {React.ReactElement} - The Persian date component
 */
const PersianDate = ({
  date,
  format = 'D MMMM YYYY',
  className = '',
  style = {},
  ...rest
}) => {
  // Convert to Date object if string is provided
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Convert to Jalali
  const jalaliDate = toJalali(dateObj);
  
  // Format date
  const formattedDate = formatJalaliDate(jalaliDate, format);
  
  // Base classes
  const baseClasses = `persian-date ${className}`;
  
  // Base styles
  const baseStyle = {
    fontFamily: 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif',
    direction: 'rtl',
    display: 'inline-block',
    ...style
  };
  
  return (
    <span className={baseClasses} style={baseStyle} {...rest}>
      {formattedDate}
    </span>
  );
};

PersianDate.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]).isRequired,
  format: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export default PersianDate; 