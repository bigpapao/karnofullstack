/**
 * Application Configuration
 * 
 * This file centralizes environment variables and configuration settings
 * to make them easily accessible throughout the application.
 */

// Analytics and Tracking
export const ANALYTICS = {
  // Google Analytics Measurement ID
  GA_MEASUREMENT_ID: process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  // Development Measurement ID (separate property for testing)
  GA_DEV_MEASUREMENT_ID: process.env.REACT_APP_GA_DEV_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  // Debug mode for analytics in non-production environments
  DEBUG: process.env.NODE_ENV !== 'production',
};

// Feature Flags
export const FEATURES = {
  // Enable/disable Google Analytics
  ANALYTICS_ENABLED: true,
  // Enable/disable search functionality
  SEARCH_ENABLED: true,
  // Enable/disable chat functionality
  CHAT_ENABLED: false,
};

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.karno.ir/api';

// Retry Configuration
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY_MS = 1000;

// Price Range Configuration
export const MAX_PRICE_RANGE = 10000000; // 10 million Tomans
export const PRICE_STEP = 100000; // 100,000 Tomans

// Popular Categories and Brands
export const POPULAR_BRANDS = ['ایران خودرو', 'سایپا', 'ام وی ام', 'بهمن موتور', 'کیا'];
export const POPULAR_CATEGORIES = ['فیلتر', 'روغن موتور', 'لنت ترمز', 'قطعات موتور', 'چراغ'];

// Payment and Shipping
export const PAYMENT_METHODS = ['آنلاین', 'کارت به کارت', 'پرداخت در محل'];
export const SHIPPING_METHODS = ['پست پیشتاز', 'تیپاکس', 'ارسال سریع'];

// Pagination
export const ITEMS_PER_PAGE = 12;

// Direction and Language
export const DEFAULT_DIRECTION = 'rtl';
export const DEFAULT_LANGUAGE = 'fa';

// Export configuration
const config = {
  API_BASE_URL,
  MAX_RETRY_ATTEMPTS,
  RETRY_DELAY_MS,
  MAX_PRICE_RANGE,
  PRICE_STEP,
  POPULAR_BRANDS,
  POPULAR_CATEGORIES,
  PAYMENT_METHODS,
  SHIPPING_METHODS,
  ITEMS_PER_PAGE,
  DEFAULT_DIRECTION,
  DEFAULT_LANGUAGE
};

export default config; 