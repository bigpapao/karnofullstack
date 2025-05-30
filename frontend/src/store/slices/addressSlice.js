/**
 * Address Slice
 * 
 * Redux slice for managing user addresses in the application.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import addressService from '../../services/address.service';

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAddresses();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch addresses' });
    }
  }
);

export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressService.addAddress(addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add address' });
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await addressService.updateAddress(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update address' });
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      await addressService.deleteAddress(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete address' });
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (id, { rejectWithValue }) => {
    try {
      const response = await addressService.setDefaultAddress(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to set default address' });
    }
  }
);

// Initial state
const initialState = {
  addresses: [],
  loading: false,
  error: null,
  selectedAddress: null
};

// Address slice
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Select an address
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    
    // Clear any errors
    clearAddressError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch addresses';
      })
      
      // Add address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
        state.loading = false;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add address';
      })
      
      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update address';
      })
      
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete address';
      })
      
      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        // Update all addresses to set isDefaultAddress to false
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefaultAddress: addr._id === action.payload._id
        }));
        state.loading = false;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to set default address';
      });
  }
});

// Export actions and reducer
export const { selectAddress, clearAddressError } = addressSlice.actions;
export default addressSlice.reducer; 