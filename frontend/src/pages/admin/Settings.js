import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Mock settings data
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'کارنو',
    siteDescription: 'فروشگاه آنلاین قطعات خودرو',
    contactEmail: 'info@karno.ir',
    contactPhone: '021-12345678',
    address: 'تهران، خیابان ولیعصر، پلاک 123',
    currency: 'تومان',
    currencySymbol: '₺',
    enableRegistration: true,
    enableGuestCheckout: true,
    maintenanceMode: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    zarinpalMerchantId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    enableZarinpal: true,
    enableCashOnDelivery: true,
    minimumOrderAmount: '50000',
    shippingCost: '20000',
    freeShippingThreshold: '500000',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableSmsNotifications: true,
    smsApiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    smsLineNumber: '3000XXXX',
    sendOrderConfirmation: true,
    sendShippingUpdates: true,
    sendAdminNewOrderAlert: true,
    adminNotificationEmail: 'admin@karno.ir',
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleGeneralChange = (event) => {
    const { name, value, checked } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    setGeneralSettings({
      ...generalSettings,
      [name]: newValue,
    });
  };

  const handlePaymentChange = (event) => {
    const { name, value, checked } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    setPaymentSettings({
      ...paymentSettings,
      [name]: newValue,
    });
  };

  const handleNotificationChange = (event) => {
    const { name, value, checked } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    setNotificationSettings({
      ...notificationSettings,
      [name]: newValue,
    });
  };

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    setSnackbar({
      open: true,
      message: 'تنظیمات با موفقیت ذخیره شد',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, direction: 'rtl' }}>
        تنظیمات سایت
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="تنظیمات عمومی" />
          <Tab label="پرداخت و ارسال" />
          <Tab label="اعلان‌ها و پیامک‌ها" />
        </Tabs>

        {/* General Settings */}
        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3} direction="row-reverse">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="نام سایت"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ sx: { direction: 'rtl' } }}
                  InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                />
                <TextField
                  fullWidth
                  label="توضیحات سایت"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={2}
                  InputProps={{ sx: { direction: 'rtl' } }}
                  InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                />
                <TextField
                  fullWidth
                  label="ایمیل تماس"
                  name="contactEmail"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ sx: { direction: 'rtl' } }}
                  InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                />
                <TextField
                  fullWidth
                  label="شماره تماس"
                  name="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={handleGeneralChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ sx: { direction: 'rtl' } }}
                  InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="آدرس"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={2}
                  InputProps={{ sx: { direction: 'rtl' } }}
                  InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="currency-label" sx={{ transformOrigin: 'right' }}>واحد پول</InputLabel>
                  <Select
                    labelId="currency-label"
                    name="currency"
                    value={generalSettings.currency}
                    onChange={handleGeneralChange}
                    label="واحد پول"
                    sx={{ direction: 'rtl' }}
                  >
                    <MenuItem value="تومان">تومان</MenuItem>
                    <MenuItem value="ریال">ریال</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="نماد واحد پول"
                  name="currencySymbol"
                  value={generalSettings.currencySymbol}
                  onChange={handleGeneralChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ sx: { direction: 'rtl' } }}
                  InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                />
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.enableRegistration}
                        onChange={handleGeneralChange}
                        name="enableRegistration"
                        color="primary"
                      />
                    }
                    label="امکان ثبت نام کاربران"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.enableGuestCheckout}
                        onChange={handleGeneralChange}
                        name="enableGuestCheckout"
                        color="primary"
                      />
                    }
                    label="امکان خرید مهمان"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.maintenanceMode}
                        onChange={handleGeneralChange}
                        name="maintenanceMode"
                        color="primary"
                      />
                    }
                    label="حالت تعمیر و نگهداری"
                    sx={{ display: 'block' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Payment Settings */}
        {tab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3} direction="row-reverse">
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader title="زرین‌پال" sx={{ direction: 'rtl' }} />
                  <CardContent>
                    <TextField
                      fullWidth
                      label="کد پذیرنده زرین‌پال"
                      name="zarinpalMerchantId"
                      value={paymentSettings.zarinpalMerchantId}
                      onChange={handlePaymentChange}
                      margin="normal"
                      variant="outlined"
                      InputProps={{ sx: { direction: 'rtl' } }}
                      InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={paymentSettings.enableZarinpal}
                          onChange={handlePaymentChange}
                          name="enableZarinpal"
                          color="primary"
                        />
                      }
                      label="فعال‌سازی درگاه زرین‌پال"
                      sx={{ display: 'block', mt: 1 }}
                    />
                  </CardContent>
                </Card>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentSettings.enableCashOnDelivery}
                      onChange={handlePaymentChange}
                      name="enableCashOnDelivery"
                      color="primary"
                    />
                  }
                  label="امکان پرداخت در محل"
                  sx={{ display: 'block', mb: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="تنظیمات ارسال" sx={{ direction: 'rtl' }} />
                  <CardContent>
                    <TextField
                      fullWidth
                      label="حداقل مبلغ سفارش (تومان)"
                      name="minimumOrderAmount"
                      value={paymentSettings.minimumOrderAmount}
                      onChange={handlePaymentChange}
                      margin="normal"
                      variant="outlined"
                      type="number"
                      InputProps={{ sx: { direction: 'rtl' } }}
                      InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                    />
                    <TextField
                      fullWidth
                      label="هزینه ارسال (تومان)"
                      name="shippingCost"
                      value={paymentSettings.shippingCost}
                      onChange={handlePaymentChange}
                      margin="normal"
                      variant="outlined"
                      type="number"
                      InputProps={{ sx: { direction: 'rtl' } }}
                      InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                    />
                    <TextField
                      fullWidth
                      label="حداقل مبلغ برای ارسال رایگان (تومان)"
                      name="freeShippingThreshold"
                      value={paymentSettings.freeShippingThreshold}
                      onChange={handlePaymentChange}
                      margin="normal"
                      variant="outlined"
                      type="number"
                      InputProps={{ sx: { direction: 'rtl' } }}
                      InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Notification Settings */}
        {tab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3} direction="row-reverse">
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader title="تنظیمات پیامک" sx={{ direction: 'rtl' }} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.enableSmsNotifications}
                          onChange={handleNotificationChange}
                          name="enableSmsNotifications"
                          color="primary"
                        />
                      }
                      label="فعال‌سازی اطلاع‌رسانی پیامکی"
                      sx={{ display: 'block', mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="کلید API سرویس پیامک"
                      name="smsApiKey"
                      value={notificationSettings.smsApiKey}
                      onChange={handleNotificationChange}
                      margin="normal"
                      variant="outlined"
                      InputProps={{ sx: { direction: 'rtl' } }}
                      InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                    />
                    <TextField
                      fullWidth
                      label="شماره خط پیامک"
                      name="smsLineNumber"
                      value={notificationSettings.smsLineNumber}
                      onChange={handleNotificationChange}
                      margin="normal"
                      variant="outlined"
                      InputProps={{ sx: { direction: 'rtl' } }}
                      InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="تنظیمات اعلان‌ها" sx={{ direction: 'rtl' }} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sendOrderConfirmation}
                          onChange={handleNotificationChange}
                          name="sendOrderConfirmation"
                          color="primary"
                        />
                      }
                      label="ارسال پیامک تأیید سفارش به مشتری"
                      sx={{ display: 'block', mb: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sendShippingUpdates}
                          onChange={handleNotificationChange}
                          name="sendShippingUpdates"
                          color="primary"
                        />
                      }
                      label="ارسال پیامک وضعیت ارسال به مشتری"
                      sx={{ display: 'block', mb: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sendAdminNewOrderAlert}
                          onChange={handleNotificationChange}
                          name="sendAdminNewOrderAlert"
                          color="primary"
                        />
                      }
                      label="ارسال اعلان سفارش جدید به مدیر"
                      sx={{ display: 'block', mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="ایمیل اعلان‌های مدیریت"
                      name="adminNotificationEmail"
                      value={notificationSettings.adminNotificationEmail}
                      onChange={handleNotificationChange}
                      margin="normal"
                      variant="outlined"
                      InputProps={{ sx: { direction: 'rtl' } }}
                      InputLabelProps={{ sx: { transformOrigin: 'right' } }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          بازنشانی
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          ذخیره تنظیمات
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 