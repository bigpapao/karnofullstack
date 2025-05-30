/**
 * Profile Actions - Centralized profile data fetching
 * This file contains actions for managing user profile data in a centralized way
 * to prevent redundant API calls across components
 */

import { 
  setLoading, 
  setError, 
  clearError 
} from '../slices/authSlice';
import { authService } from '../../services/auth.service';

// Action Types
export const PROFILE_DATA_SUCCESS = 'profile/dataSuccess';
export const PROFILE_STATUS_SUCCESS = 'profile/statusSuccess';
export const PROFILE_UPDATE_SUCCESS = 'profile/updateSuccess';

/**
 * Action creators
 */
export const setProfileData = (user) => ({
  type: PROFILE_DATA_SUCCESS,
  payload: user
});

export const setProfileStatus = (status) => ({
  type: PROFILE_STATUS_SUCCESS,
  payload: status
});

export const setProfileUpdateSuccess = (message) => ({
  type: PROFILE_UPDATE_SUCCESS,
  payload: message
});

/**
 * Fetch all profile-related data in a single action
 * This prevents multiple API calls from different components
 */
export const fetchProfileData = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  
  try {
    // Make parallel API calls for efficiency
    const [profileResponse, statusResponse] = await Promise.all([
      authService.getProfile(),
      authService.getProfileStatus()
    ]);
    
    // Update Redux store with profile data
    dispatch(setProfileData(profileResponse.data.user));
    dispatch(setProfileStatus(statusResponse.data));
    
    return {
      user: profileResponse.data.user,
      status: statusResponse.data
    };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'خطا در دریافت اطلاعات پروفایل'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Update user profile data
 */
export const updateProfileData = (profileData) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  
  try {
    const response = await authService.updateProfile(profileData);
    
    // Update profile data in store
    dispatch(setProfileData(response.data.user));
    dispatch(setProfileUpdateSuccess('اطلاعات پروفایل با موفقیت به‌روزرسانی شد'));
    
    // Fetch updated profile status
    const statusResponse = await authService.getProfileStatus();
    dispatch(setProfileStatus(statusResponse.data));
    
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Send OTP verification code
 */
export const sendVerificationCode = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  
  try {
    const response = await authService.sendOTP();
    dispatch(setLoading(false));
    return response;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'خطا در ارسال کد تأیید'));
    dispatch(setLoading(false));
    return null;
  }
};

/**
 * Verify OTP code
 */
export const verifyOTPCode = (code) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  
  try {
    const response = await authService.verifyOTP(code);
    
    // Update profile data in store
    dispatch(setProfileData(response.data.user));
    
    // Fetch updated profile status
    const statusResponse = await authService.getProfileStatus();
    dispatch(setProfileStatus(statusResponse.data));
    
    dispatch(setLoading(false));
    return response;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'کد تأیید نامعتبر است'));
    dispatch(setLoading(false));
    return null;
  }
};

export default {
  fetchProfileData,
  updateProfileData,
  sendVerificationCode,
  verifyOTPCode
}; 