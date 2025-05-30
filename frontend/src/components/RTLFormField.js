import React from 'react';
import PropTypes from 'prop-types';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Autocomplete,
  Box
} from '@mui/material';
import { useDirection } from '../contexts/DirectionContext';

/**
 * RTLFormField Component
 * 
 * A wrapper component for Material UI form fields that handles RTL-specific styling
 * and behavior. This ensures consistent form field appearance in RTL mode.
 * 
 * @param {Object} props - Component props
 */
const RTLFormField = ({
  component = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  readOnly = false,
  placeholder,
  startAdornment,
  endAdornment,
  options = [],
  getOptionLabel,
  ...rest
}) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  // Common props for all input types
  const commonProps = {
    name,
    value,
    onChange,
    onBlur,
    disabled,
    required,
    fullWidth,
    error: !!error,
    ...rest
  };
  
  // Handle different input types
  switch (component) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
      return (
        <TextField
          label={label}
          placeholder={placeholder}
          type={component}
          helperText={error || helperText}
          InputProps={{
            readOnly,
            startAdornment: isRTL ? endAdornment : startAdornment,
            endAdornment: isRTL ? startAdornment : endAdornment,
          }}
          inputProps={{
            dir: component === 'email' || (typeof value === 'string' && /^[A-Za-z0-9]/.test(value)) ? 'ltr' : 'inherit',
          }}
          {...commonProps}
        />
      );
    
    case 'select':
      return (
        <FormControl error={!!error} fullWidth={fullWidth} required={required} disabled={disabled}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            label={label}
            {...commonProps}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error || helperText) && (
            <FormHelperText>{error || helperText}</FormHelperText>
          )}
        </FormControl>
      );
    
    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              {...commonProps}
            />
          }
          label={label}
          disabled={disabled}
        />
      );
    
    case 'radio':
      return (
        <FormControl component="fieldset" error={!!error} disabled={disabled}>
          {label && <InputLabel>{label}</InputLabel>}
          <RadioGroup {...commonProps}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {(error || helperText) && (
            <FormHelperText>{error || helperText}</FormHelperText>
          )}
        </FormControl>
      );
    
    case 'textarea':
      return (
        <TextField
          label={label}
          placeholder={placeholder}
          multiline
          rows={rest.rows || 4}
          helperText={error || helperText}
          InputProps={{
            readOnly,
          }}
          {...commonProps}
        />
      );
    
    case 'autocomplete':
      return (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel || (option => option.label)}
          fullWidth={fullWidth}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onChange={(event, newValue) => {
            if (onChange) {
              onChange({
                target: { name, value: newValue }
              });
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              helperText={error || helperText}
              error={!!error}
              required={required}
            />
          )}
          {...rest}
        />
      );
    
    default:
      return null;
  }
};

RTLFormField.propTypes = {
  component: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'select', 'checkbox', 'radio', 'textarea', 'autocomplete']),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired
    })
  ),
  getOptionLabel: PropTypes.func,
};

export default RTLFormField; 