import axios from 'axios';
import store from '../store';
import { logoutUser } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Log the full request URL for debugging
    console.log('Making request to:', config.baseURL + config.url);
    
    // No longer automatically adding Authorization header, as HttpOnly cookies are used.
    // The backend will handle authentication based on these cookies.

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      // Handle 401 Unauthorized response
      if (error.response.status === 401 && !originalRequest._retry) {
        // Don't try to refresh if this was already a refresh token request
        if (originalRequest.url === '/auth/refresh-token') {
          store.dispatch(logoutUser());
          return Promise.reject(error);
        }
        
        if (isRefreshing) {
          // If we're already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // Attempt to refresh the token
          await api.post('/auth/refresh-token');
          
          // Token refresh successful, process the queue
          processQueue(null);
          isRefreshing = false;
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Token refresh failed, logout user
          processQueue(refreshError);
          isRefreshing = false;
          store.dispatch(logoutUser());
          return Promise.reject(refreshError);
        }
      }
      
      // Handle 403 Forbidden response
      if (error.response.status === 403) {
        console.error('Access forbidden. Insufficient permissions or other restriction.');
      }
      
      // Return error message from the server if available
      const message = error.response.data?.message || error.message;
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export default api;

