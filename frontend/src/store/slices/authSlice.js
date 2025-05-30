import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { cartService } from '../../services/cart.service';

// Async thunks
export const requestPhoneVerification = createAsyncThunk(
  'auth/requestPhoneVerification',
  async ({ phone }, { rejectWithValue }) => {
    try {
      const data = await authService.requestPhoneVerification(phone);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const verifyPhone = createAsyncThunk(
  'auth/verifyPhone',
  async ({ phone, code, firstName, lastName }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyPhone(phone, code, firstName, lastName);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      // credentials can be { email, password } or { phone, password, rememberMe, sessionId }
      const data = await authService.login(credentials);
      
      // If remember me is set, store the refresh token with a longer expiry
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Sync guest cart if sessionId is provided
      if (credentials.sessionId) {
        try {
          await dispatch(syncGuestCart());
        } catch (cartError) {
          console.error('Cart merging error:', cartError);
          // Don't fail login if cart merging fails
        }
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      console.log('Registering user with data:', { ...userData, password: '[REDACTED]' });
      const data = await authService.register(userData);
      
      // Sync guest cart if sessionId is provided
      if (userData.sessionId) {
        try {
          await dispatch(syncGuestCart());
        } catch (cartError) {
          console.error('Cart merging error:', cartError);
          // Don't fail registration if cart merging fails
        }
      }
      
      return data;
    } catch (error) {
      console.error('Registration error in thunk:', error);
      return rejectWithValue(error);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
      try {
      const data = await authService.verifyEmail(token);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const data = await authService.getProfile();
      return data;
    } catch (error) {
      // If profile fetch fails due to 401, user is not authenticated
      // This is normal behavior for checking auth status, don't treat as error
      if (error.message && error.message.includes('401')) {
        return rejectWithValue({ notAuthenticated: true });
      }
      return rejectWithValue(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(token, password);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProfileStatus = createAsyncThunk(
  'auth/getProfileStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfileStatus();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Cart sync thunk for merging guest cart with user cart
export const syncGuestCart = createAsyncThunk(
  'auth/syncGuestCart',
  async (_, { rejectWithValue }) => {
    try {
      // Get guest cart from localStorage
      const guestCart = localStorage.getItem('cart');
      if (!guestCart) {
        return null; // No guest cart to sync
      }

      const guestCartItems = JSON.parse(guestCart);
      if (!Array.isArray(guestCartItems) || guestCartItems.length === 0) {
        return null; // Empty cart
      }

      // Send guest cart to backend for merging
      const response = await cartService.syncCart(guestCartItems);
      
      // Clear guest cart from localStorage after successful sync
      localStorage.removeItem('cart');
      
      return response;
    } catch (error) {
      console.error('Guest cart sync error:', error);
      return rejectWithValue(error);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const data = await authService.getProfile();
      return data;
    } catch (error) {
      // If auth check fails, this is normal - user just isn't authenticated
      return rejectWithValue({ notAuthenticated: true });
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  profileLoading: false,
  error: null,
  authChecked: false, // Track if auth status has been verified
  successMessage: null,
  profileStatusLoading: true,
  profileStatusError: null,
  profileStatus: null,
  cartSyncing: false,
  cartSyncError: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
      state.authChecked = true;
      // HTTP-only cookies are handled by the backend
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
      // Cookies will be cleared by the backend
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.authChecked = true;
      // Cookies will be cleared by the backend logout endpoint
      localStorage.removeItem('rememberMe');
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    // Initialize auth state - with cookie-based auth, we need to check with the server
    initializeAuth: (state) => {
      // Can't determine auth status from localStorage since we use HTTP-only cookies
      // Will need to call getProfile to check authentication status
      state.isAuthenticated = false;
      state.user = null;
      state.authChecked = false;
    }
  },
  extraReducers: (builder) => {
    // Phone Verification Request
    builder
      .addCase(requestPhoneVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPhoneVerification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestPhoneVerification.rejected, (state, action) => {
        state.loading = false;
        // Ensure error is always a string
        const error = action.payload;
        if (typeof error === 'object' && error.message) {
          state.error = error.message;
        } else if (typeof error === 'string') {
          state.error = error;
        } else {
          state.error = 'خطا در ارسال کد تایید';
        }
      });

    // Phone Verification
    builder
      .addCase(verifyPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.authChecked = true;
        // Token is handled via HTTP-only cookies
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.loading = false;
        // Ensure error is always a string
        const error = action.payload;
        if (typeof error === 'object' && error.message) {
          state.error = error.message;
        } else if (typeof error === 'string') {
          state.error = error;
        } else {
          state.error = 'خطا در تایید شماره موبایل';
        }
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.successMessage = 'ورود موفقیت‌آمیز';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        // Ensure error is always a string
        const error = action.payload;
        if (typeof error === 'object' && error.message) {
          state.error = error.message;
        } else if (typeof error === 'string') {
          state.error = error;
        } else {
          state.error = 'خطا در ورود';
        }
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.successMessage = action.payload.message || 'ثبت‌نام با موفقیت انجام شد';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        // Ensure error is always a string or has proper structure
        const error = action.payload;
        if (typeof error === 'object' && error.message) {
          state.error = error.message;
        } else if (typeof error === 'string') {
          state.error = error;
        } else {
          state.error = 'خطا در ثبت نام';
        }
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        // Cookies are cleared by the backend, only remove localStorage items
        localStorage.removeItem('rememberMe');
      });

    // Check Auth (on app initialization)
    builder
      .addCase(checkAuth.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload.user || action.payload.data?.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.profileLoading = false;
        state.authChecked = true;
        state.isAuthenticated = false;
        state.user = null;
        // Don't set error for normal "not authenticated" case
        const error = action.payload;
        if (error && !error.notAuthenticated) {
          state.error = typeof error === 'string' ? error : 'خطا در بررسی وضعیت احراز هویت';
        }
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload.user || action.payload.data?.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.authChecked = true;
        const error = action.payload;
        if (error && error.notAuthenticated) {
          // This is normal - user is not authenticated
          state.isAuthenticated = false;
          state.user = null;
        } else {
          // This is an actual error
          if (typeof error === 'object' && error.message) {
            state.error = error.message;
          } else if (typeof error === 'string') {
            state.error = error;
          } else {
            state.error = 'خطا در دریافت اطلاعات کاربری';
          }
        }
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'اطلاعات پروفایل با موفقیت به‌روزرسانی شد';
        state.user = action.payload.data.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'خطا در به‌روزرسانی پروفایل';
      });

    // Verify Email
    builder
      .addCase(verifyEmail.fulfilled, (state) => {
        state.successMessage = 'Email verified successfully';
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.fulfilled, (state) => {
        state.successMessage = 'Password reset instructions sent to your email';
      });

    // Reset Password
    builder
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.successMessage = 'Password reset successful';
        // Token is handled via HTTP-only cookies
      });

    // Get Profile Status  
    builder
      .addCase(getProfileStatus.pending, (state) => {
        state.profileStatusLoading = true;
        state.profileStatusError = null;
      })
      .addCase(getProfileStatus.fulfilled, (state, action) => {
        state.profileStatusLoading = false;
        state.profileStatus = action.payload.data;
      })
      .addCase(getProfileStatus.rejected, (state, action) => {
        state.profileStatusLoading = false;
        state.profileStatusError = action.payload || 'خطا در دریافت وضعیت پروفایل';
      });

    // Cart Sync
    builder
      .addCase(syncGuestCart.pending, (state) => {
        state.cartSyncing = true;
        state.cartSyncError = null;
      })
      .addCase(syncGuestCart.fulfilled, (state) => {
        state.cartSyncing = false;
      })
      .addCase(syncGuestCart.rejected, (state, action) => {
        state.cartSyncing = false;
        state.cartSyncError = action.payload;
      });
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError,
  setLoading,
  setSuccessMessage,
  clearSuccessMessage,
  initializeAuth
} = authSlice.actions;

export default authSlice.reducer;
