/**
 * Address Form Component
 * 
 * A reusable form component for collecting and validating shipping/billing addresses.
 * Features real-time address validation through integration with Google Address Validation API.
 * Restricted to Iran addresses only.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  Checkbox,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Paper,
  Collapse
} from '@mui/material';
import { CheckCircle, Error, LocationOn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { validateAddressField, validateAddress } from '../utils/addressValidation';

// Iranian provinces
const iranianProvinces = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'آذربایجان غربی', 'اردبیل', 'البرز', 'ایلام', 'بوشهر',
  'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان شمالی', 'خوزستان',
  'زنجان', 'سمنان', 'سیستان و بلوچستان', 'کردستان', 'کرمان',
  'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان', 'لرستان',
  'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد'
];

/**
 * AddressForm Component
 * 
 * @param {Object} props
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onChange - Function to call when form values change
 * @param {boolean} props.showValidation - Whether to show validation UI
 */
const AddressForm = ({ 
  initialValues = {}, 
  onSubmit,
  onChange,
  showValidation = true,
  buttonText = 'ذخیره آدرس',
  validateOnChange = false,
  validateOnBlur = true
}) => {
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IR', // Only Iran is allowed
    addressType: 'home',
    isDefaultAddress: false,
    additionalInfo: '',
    ...initialValues
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Address validation state
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      // Always ensure country is IR
      setFormData(prev => ({
        ...prev,
        ...initialValues,
        country: 'IR'
      }));
    }
  }, [initialValues]);
  
  // Validate a single field
  const validateField = (name, value) => {
    const error = validateAddressField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    return !error;
  };
  
  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate each field
    Object.keys(formData).forEach(field => {
      const error = validateAddressField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));
    
    return isValid;
  };
  
  // Handle field change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Skip country changes - we only allow Iran
    if (name === 'country') return;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field if needed
    if (validateOnChange && touched[name]) {
      validateField(name, newValue);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange({
        ...formData,
        [name]: newValue
      });
    }
    
    // Reset validation if address fields changed
    if (['address', 'city', 'state', 'zipCode'].includes(name)) {
      setValidationResult(null);
      setShowSuggestion(false);
    }
  };
  
  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    if (validateOnBlur) {
      validateField(name, value);
    }
  };
  
  // Handle address validation
  const handleValidateAddress = async () => {
    // Check if we have the necessary fields
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      setErrors(prev => ({
        ...prev,
        address: !formData.address ? 'آدرس الزامی است' : '',
        city: !formData.city ? 'شهر الزامی است' : '',
        state: !formData.state ? 'استان الزامی است' : '',
        zipCode: !formData.zipCode ? 'کد پستی الزامی است' : ''
      }));
      return;
    }
    
    setValidating(true);
    
    try {
      await validateAddress(
        {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'IR' // Always use Iran
        },
        // Success callback
        (data) => {
          setValidationResult(data);
          setValidating(false);
          
          // Show suggestion if address is not valid and we have suggestions
          if (!data.isValid && data.suggestion) {
            setShowSuggestion(true);
          }
        },
        // Error callback
        (error) => {
          setValidationResult({
            isValid: false,
            error: error.message || 'خطا در اعتبارسنجی آدرس'
          });
          setValidating(false);
        }
      );
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: error.message || 'خطا در اعتبارسنجی آدرس'
      });
      setValidating(false);
    }
  };
  
  // Apply suggested address
  const applySuggestion = () => {
    if (!validationResult || !validationResult.suggestion) return;
    
    const suggestion = validationResult.suggestion;
    
    setFormData(prev => ({
      ...prev,
      address: suggestion.streetNumber && suggestion.streetName ? 
        `${suggestion.streetNumber} ${suggestion.streetName}` : prev.address,
      city: suggestion.city || prev.city,
      state: suggestion.state || prev.state,
      zipCode: suggestion.zipCode || prev.zipCode
    }));
    
    // Hide suggestion
    setShowSuggestion(false);
    
    // Reset validation result
    setValidationResult({
      ...validationResult,
      isValid: true
    });
    
    // Call onChange callback
    if (onChange) {
      onChange({
        ...formData,
        address: suggestion.streetNumber && suggestion.streetName ? 
          `${suggestion.streetNumber} ${suggestion.streetName}` : formData.address,
        city: suggestion.city || formData.city,
        state: suggestion.state || formData.state,
        zipCode: suggestion.zipCode || formData.zipCode
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      onSubmit({...formData, country: 'IR'});
    }
  };
  
  // Render validation result
  const renderValidationResult = () => {
    if (!showValidation) return null;
    
    if (validating) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">در حال اعتبارسنجی آدرس...</Typography>
        </Box>
      );
    }
    
    if (!validationResult) return null;
    
    if (validationResult.error) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {validationResult.error}
        </Alert>
      );
    }
    
    return (
      <>
        <Alert 
          severity={validationResult.isValid ? "success" : "warning"} 
          icon={validationResult.isValid ? <CheckCircle /> : <Error />}
          sx={{ mt: 2 }}
        >
          {validationResult.isValid 
            ? 'آدرس وارد شده معتبر است.'
            : 'آدرس وارد شده ممکن است ناقص یا نادرست باشد.'
          }
        </Alert>
        
        <Collapse in={showSuggestion}>
          {validationResult.suggestion && (
            <Paper 
              elevation={0} 
              sx={{ 
                mt: 2, 
                p: 2, 
                border: `1px solid ${theme.palette.warning.light}`,
                borderRadius: 1,
                backgroundColor: theme.palette.warning.light + '10'
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                آدرس پیشنهادی:
              </Typography>
              <Typography variant="body2" gutterBottom>
                {validationResult.formattedAddress || `${validationResult.suggestion.streetNumber || ''} ${validationResult.suggestion.streetName || ''}, ${validationResult.suggestion.city || ''}, ${validationResult.suggestion.state || ''} ${validationResult.suggestion.zipCode || ''}`}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={applySuggestion}
                startIcon={<LocationOn />}
              >
                استفاده از آدرس پیشنهادی
              </Button>
            </Paper>
          )}
        </Collapse>
      </>
    );
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} dir="rtl">
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            در حال حاضر، ارسال محصولات فقط به آدرس‌های داخل ایران امکان‌پذیر است.
          </Alert>
        </Grid>
      
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="fullName"
            name="fullName"
            label="نام و نام خانوادگی"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fullName && !!errors.fullName}
            helperText={touched.fullName && errors.fullName}
            variant="outlined"
            dir="rtl"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="شماره موبایل"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phoneNumber && !!errors.phoneNumber}
            helperText={touched.phoneNumber && errors.phoneNumber}
            variant="outlined"
            placeholder="09123456789"
            dir="ltr"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="address"
            name="address"
            label="آدرس کامل"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.address && !!errors.address}
            helperText={touched.address && errors.address}
            variant="outlined"
            multiline
            rows={2}
            dir="rtl"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={touched.state && !!errors.state}>
            <InputLabel id="state-label">استان</InputLabel>
            <Select
              labelId="state-label"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              label="استان"
            >
              {iranianProvinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
            {touched.state && errors.state && (
              <FormHelperText>{errors.state}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="city"
            name="city"
            label="شهر"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.city && !!errors.city}
            helperText={touched.city && errors.city}
            variant="outlined"
            dir="rtl"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="zipCode"
            name="zipCode"
            label="کد پستی"
            value={formData.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.zipCode && !!errors.zipCode}
            helperText={(touched.zipCode && errors.zipCode) || 'کد پستی ایران باید ۱۰ رقم باشد'}
            variant="outlined"
            dir="ltr"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="body2" gutterBottom>
              نوع آدرس
            </Typography>
            <Grid container>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.addressType === 'home'}
                      onChange={() => handleChange({ target: { name: 'addressType', value: 'home' } })}
                      name="addressType"
                    />
                  }
                  label="منزل"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.addressType === 'work'}
                      onChange={() => handleChange({ target: { name: 'addressType', value: 'work' } })}
                      name="addressType"
                    />
                  }
                  label="محل کار"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.addressType === 'other'}
                      onChange={() => handleChange({ target: { name: 'addressType', value: 'other' } })}
                      name="addressType"
                    />
                  }
                  label="سایر"
                />
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isDefaultAddress}
                onChange={handleChange}
                name="isDefaultAddress"
                color="primary"
              />
            }
            label="ذخیره به عنوان آدرس پیش‌فرض"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="additionalInfo"
            name="additionalInfo"
            label="توضیحات اضافی (اختیاری)"
            value={formData.additionalInfo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.additionalInfo && !!errors.additionalInfo}
            helperText={touched.additionalInfo && errors.additionalInfo}
            variant="outlined"
            multiline
            rows={2}
            dir="rtl"
          />
        </Grid>
        
        {showValidation && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleValidateAddress}
                disabled={validating}
                startIcon={validating ? <CircularProgress size={20} /> : <LocationOn />}
              >
                اعتبارسنجی آدرس
              </Button>
            </Box>
            {renderValidationResult()}
          </Grid>
        )}
        
        {buttonText && (
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              {buttonText}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AddressForm; 