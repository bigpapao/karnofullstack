import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider, DatePicker, DateCalendar } from '@mui/x-date-pickers';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { toPersianNumbers } from '../utils/typographyUtils';
import { useDirection } from '../contexts/DirectionContext';

/**
 * PersianDateRangePicker Component
 * 
 * A component for selecting a date range with Persian (Jalali) calendar
 * Supports RTL layout and Persian number formatting
 * 
 * @param {Object} props - Component props
 * @returns {React.ReactElement} - The Persian date range picker component
 */
const PersianDateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = 'تاریخ شروع',
  endLabel = 'تاریخ پایان',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  readOnly = false,
  usePersianDigits = true,
  startName = 'startDate',
  endName = 'endDate',
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
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  // Generate formatted date string
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

  // Handle opening the date picker
  const handleOpen = (isStartDate) => {
    if (!disabled && !readOnly) {
      setSelectingStartDate(isStartDate);
      setOpen(true);
    }
  };

  // Handle date selection
  const handleDateChange = (newDate) => {
    if (selectingStartDate) {
      if (onStartDateChange) {
        onStartDateChange(newDate, startName);
      }
      
      // If we're selecting a start date and end date is set and less than start date,
      // also update end date to start date
      if (endDate && newDate && new Date(newDate) > new Date(endDate)) {
        if (onEndDateChange) {
          onEndDateChange(newDate, endName);
        }
      }
    } else {
      // Make sure end date isn't before start date
      if (startDate && newDate && new Date(newDate) < new Date(startDate)) {
        if (onEndDateChange) {
          onEndDateChange(startDate, endName);
        }
      } else if (onEndDateChange) {
        onEndDateChange(newDate, endName);
      }
    }
    
    setOpen(false);
  };

  // Create input field with icon
  const renderTextField = (isStartDate) => {
    const value = isStartDate ? startDate : endDate;
    const label = isStartDate ? startLabel : endLabel;
    const name = isStartDate ? startName : endName;
    
    return (
      <TextField
        fullWidth={fullWidth}
        label={label}
        value={formatDate(value)}
        error={!!error}
        helperText={isStartDate ? error || helperText : null}
        disabled={disabled}
        required={required}
        name={name}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={() => handleOpen(isStartDate)}
        InputProps={{
          readOnly: true,
          style: { direction: isRTL ? 'rtl' : 'ltr' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                edge="end" 
                onClick={() => handleOpen(isStartDate)}
                disabled={disabled}
              >
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...rest}
      />
    );
  };

  // Calculate appropriate min/max dates
  const getDateLimits = () => {
    let currentMinDate = minDate;
    let currentMaxDate = maxDate;
    
    // If selecting end date and start date is set, 
    // don't allow selecting dates before start date
    if (!selectingStartDate && startDate) {
      currentMinDate = new Date(startDate) > (minDate || new Date(0)) 
        ? startDate 
        : minDate;
    }
    
    // If selecting start date and end date is set,
    // don't allow selecting dates after end date
    if (selectingStartDate && endDate) {
      currentMaxDate = new Date(endDate) < (maxDate || new Date(8640000000000000)) 
        ? endDate 
        : maxDate;
    }
    
    return { currentMinDate, currentMaxDate };
  };

  const { currentMinDate, currentMaxDate } = getDateLimits();

  return (
    <Box className={`persian-date-range-picker ${className}`} style={style}>
      <Stack 
        direction={isRTL ? "row-reverse" : "row"} 
        spacing={2} 
        sx={{ width: fullWidth ? '100%' : 'auto' }}
      >
        {renderTextField(true)}
        {renderTextField(false)}
      </Stack>

      {open && (
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setOpen(false)}
          >
            <Box
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 2,
                direction: isRTL ? 'rtl' : 'ltr',
                maxWidth: '90%',
                maxHeight: '90%',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography variant="h6" sx={{ mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
                {selectingStartDate ? startLabel : endLabel}
              </Typography>
              
              <DateCalendar
                value={selectingStartDate ? startDate : endDate}
                onChange={handleDateChange}
                minDate={currentMinDate}
                maxDate={currentMaxDate}
                disableFuture={disableFuture}
                disablePast={disablePast}
                sx={{
                  '& .MuiPickersDay-root': {
                    fontFamily: isRTL ? 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif' : 'inherit',
                  },
                }}
              />
            </Box>
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  );
};

PersianDateRangePicker.propTypes = {
  startDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]),
  endDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]),
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  readOnly: PropTypes.bool,
  usePersianDigits: PropTypes.bool,
  startName: PropTypes.string,
  endName: PropTypes.string,
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

export default PersianDateRangePicker; 