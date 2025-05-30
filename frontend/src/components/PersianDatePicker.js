import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { toPersianNumbers } from '../utils/typographyUtils';
import { useDirection } from '../contexts/DirectionContext';

/**
 * PersianDatePicker Component
 * 
 * A datepicker component that uses Jalali (Persian) calendar
 * Supports RTL layout and Persian number formatting
 * 
 * @param {Object} props - Component props
 * @returns {React.ReactElement} - The Persian date picker component
 */
const PersianDatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  readOnly = false,
  usePersianDigits = true,
  name,
  minDate,
  maxDate,
  className = '',
  style = {},
  disableFuture = false,
  disablePast = false,
  format = 'yyyy/MM/dd',
  showToolbar = true,
  onBlur,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  // Date format localization function
  const formatDate = (date) => {
    if (!date) return '';
    
    try {
      // Format date based on format string
      const dateObject = new Date(date);
      if (isNaN(dateObject.getTime())) return '';

      const year = dateObject.getFullYear();
      const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObject.getDate().toString().padStart(2, '0');
      
      let formattedDate = format
        .replace('yyyy', year)
        .replace('MM', month)
        .replace('dd', day);
      
      // Convert to Persian digits if requested
      if (usePersianDigits) {
        formattedDate = toPersianNumbers(formattedDate);
      }
      
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Handle open/close of the picker
  const handleOpen = () => {
    if (!disabled && !readOnly) {
      setOpen(true);
    }
  };

  // Handle date change from picker
  const handleDateChange = (newDate) => {
    if (onChange) {
      onChange(newDate, name);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
      <DatePicker
        value={value}
        onChange={handleDateChange}
        open={open}
        onClose={() => setOpen(false)}
        minDate={minDate}
        maxDate={maxDate}
        disableFuture={disableFuture}
        disablePast={disablePast}
        disabled={disabled}
        readOnly={readOnly}
        format={format}
        className={`persian-datepicker ${className}`}
        slotProps={{
          toolbar: { hidden: !showToolbar },
          textField: {
            fullWidth: fullWidth,
            label: label,
            error: !!error,
            helperText: error || helperText,
            required: required,
            placeholder: placeholder,
            name: name,
            onBlur: onBlur,
            onFocus: onFocus,
            InputProps: {
              readOnly: readOnly,
              style: { direction: isRTL ? 'rtl' : 'ltr' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    edge="end" 
                    onClick={handleOpen}
                    disabled={disabled}
                  >
                    <CalendarIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
            ...rest
          },
          popper: {
            sx: {
              '& .MuiPickersLayout-root': {
                direction: isRTL ? 'rtl' : 'ltr',
              },
              '& .MuiPickersCalendarHeader-root': {
                direction: isRTL ? 'rtl' : 'ltr',
              },
              '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
                direction: isRTL ? 'rtl' : 'ltr',
              },
              '& .MuiPickersDay-root': {
                fontFamily: isRTL ? 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif' : 'inherit',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

PersianDatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  readOnly: PropTypes.bool,
  usePersianDigits: PropTypes.bool,
  name: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  className: PropTypes.string,
  style: PropTypes.object,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  format: PropTypes.string,
  showToolbar: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default PersianDatePicker; 