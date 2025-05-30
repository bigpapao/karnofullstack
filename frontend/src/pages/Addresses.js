import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RTL } from '../components/RTL';
import AddressForm from '../components/AddressForm';
import addressService from '../services/address.service';
import { formatAddress, getAddressTypeLabel, shouldShowAddressType } from '../utils/addressValidation';
import { fetchAddresses, deleteAddress } from '../store/slices/addressSlice';
import Breadcrumbs from '../components/Breadcrumbs';
import AlertMessage from '../components/AlertMessage';

const Addresses = () => {
  // State management
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formKey, setFormKey] = useState(0); // Used to force re-render the form

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  
  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);
  
  // Fetch addresses from API
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await addressService.getAddresses();
      setAddresses(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('خطا در دریافت آدرس‌ها. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };
  
  // Open dialog for adding/editing address
  const handleOpenDialog = (address = null) => {
    setEditingAddress(address);
    setFormKey(prevKey => prevKey + 1); // Force form re-render
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
  };
  
  // Handle form submission for adding/editing address
  const handleSubmitAddress = async (formData) => {
    setLoading(true);
    try {
      if (editingAddress) {
        // Update existing address
        await addressService.updateAddress(editingAddress._id, formData);
      } else {
        // Add new address
        await addressService.addAddress(formData);
      }
      
      // Refresh addresses list
      await fetchAddresses();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving address:', err);
      setError('خطا در ذخیره آدرس. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle setting address as default
  const handleSetDefaultAddress = async (addressId) => {
    setLoading(true);
    try {
      await addressService.setDefaultAddress(addressId);
      await fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('خطا در تنظیم آدرس پیش‌فرض. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };
  
  // Open delete confirmation dialog
  const handleOpenDeleteConfirm = (address) => {
    setDeleteConfirm(address);
  };
  
  // Close delete confirmation dialog
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirm(null);
  };
  
  // Handle address deletion
  const handleDeleteAddress = async () => {
    if (!deleteConfirm) return;
    
    setLoading(true);
    try {
      await addressService.deleteAddress(deleteConfirm._id);
      await fetchAddresses();
      handleCloseDeleteConfirm();
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('خطا در حذف آدرس. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render address cards
  const renderAddresses = () => {
    if (loading && addresses.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (addresses.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
          <LocationIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            هیچ آدرسی ثبت نشده است
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            برای سهولت در خرید های بعدی، آدرس های خود را اضافه کنید.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            افزودن آدرس جدید
          </Button>
        </Paper>
      );
    }
    
    return (
      <Grid container spacing={3}>
        {addresses.map((address) => (
          <Grid item xs={12} md={6} key={address._id}>
            <Card sx={{ 
              borderRadius: 2, 
              position: 'relative',
              border: address.isDefaultAddress ? '2px solid' : '1px solid',
              borderColor: address.isDefaultAddress ? 'primary.main' : 'divider',
            }}>
              {address.isDefaultAddress && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '12px',
                    px: 1,
                    py: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  پیش‌فرض
                </Box>
              )}
              
              <CardContent>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="h6" component="div">
                    {address.fullName}
                  </Typography>
                </Box>
                
                {shouldShowAddressType(address) && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {getAddressTypeLabel(address)}
                  </Typography>
                )}
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {address.phoneNumber}
                </Typography>
                
                <Typography variant="body2">
                  {formatAddress(address)}
                </Typography>
              </CardContent>
              
              <Divider />
              
              <CardActions>
                <Button 
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(address)}
                >
                  ویرایش
                </Button>
                
                {!address.isDefaultAddress && (
                  <Button
                    size="small"
                    startIcon={<StarBorderIcon />}
                    onClick={() => handleSetDefaultAddress(address._id)}
                  >
                    تنظیم به عنوان پیش‌فرض
                  </Button>
                )}
                
                <Box sx={{ flexGrow: 1 }} />
                
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleOpenDeleteConfirm(address)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  return (
    <RTL>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            آدرس‌های من
          </Typography>
          
          {addresses.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              افزودن آدرس جدید
            </Button>
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {renderAddresses()}
        
        {/* Add/Edit Address Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
          </DialogTitle>
          
          <DialogContent dividers>
            <AddressForm
              key={formKey} // Force re-render when editing
              initialValues={editingAddress || {}}
              onSubmit={handleSubmitAddress}
              showValidation={true}
              buttonText={null}
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              انصراف
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                // Trigger form submission programmatically
                document.getElementById('addressFormSubmit')?.click();
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'ذخیره آدرس'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={Boolean(deleteConfirm)}
          onClose={handleCloseDeleteConfirm}
        >
          <DialogTitle>
            حذف آدرس
          </DialogTitle>
          
          <DialogContent>
            <Typography>
              آیا از حذف این آدرس اطمینان دارید؟
            </Typography>
            
            {deleteConfirm && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" gutterBottom>
                  {deleteConfirm.fullName}
                </Typography>
                <Typography variant="body2">
                  {formatAddress(deleteConfirm)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirm}>
              انصراف
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleDeleteAddress}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'حذف'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </RTL>
  );
};

export default Addresses; 