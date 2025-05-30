/**
 * Google Analytics Utility
 * 
 * This file contains functions for initializing and using Google Analytics in the application.
 * It uses react-ga4 for tracking page views, events, and user interactions.
 */
import ReactGA from 'react-ga4';
import { ANALYTICS, FEATURES } from './config';

/**
 * Initialize Google Analytics
 * @param {boolean} debug - Whether to enable debug mode
 */
export const initializeGA = (debug = false) => {
  // Only initialize if analytics is enabled
  if (FEATURES?.ANALYTICS_ENABLED) {
    // Choose between production and development measurement ID
    const gaId = process.env.NODE_ENV === 'production' 
      ? ANALYTICS.GA_MEASUREMENT_ID 
      : ANALYTICS.GA_DEV_MEASUREMENT_ID;
    
    ReactGA.initialize(gaId, {
      gaOptions: {
        // Disable automatic page view tracking - we'll handle it manually
        // to better control when and what gets tracked
        send_page_view: false
      },
      debug: debug || ANALYTICS.DEBUG
    });
    
    console.log(`Google Analytics initialized in ${process.env.NODE_ENV} mode with ID: ${gaId}`);
  }
};

/**
 * Track a page view
 * @param {string} path - The page path to track
 * @param {string} title - The page title
 */
export const trackPageView = (path, title) => {
  if (!path || !FEATURES?.ANALYTICS_ENABLED) {
    return;
  }
  
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title
  });
};

/**
 * Track an event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label (optional)
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (category, action, label = null, value = null) => {
  if (!FEATURES?.ANALYTICS_ENABLED) {
    return;
  }
  
  ReactGA.event({
    category,
    action,
    ...(label && { label }),
    ...(value !== null && { value })
  });
};

/**
 * Track product view
 * @param {string|number} productId - Product ID
 * @param {string} productName - Product name
 * @param {number} price - Product price
 */
export const trackProductView = (productId, productName, price) => {
  trackEvent('Product', 'View', productName, productId);
  
  // Also track as e-commerce event
  if (FEATURES?.ANALYTICS_ENABLED) {
    ReactGA.gtag('event', 'view_item', {
      items: [{
        item_id: productId,
        item_name: productName,
        price: price || 0
      }]
    });
  }
};

/**
 * Track adding product to cart
 * @param {string|number} productId - Product ID
 * @param {string} productName - Product name
 * @param {number} price - Product price
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (productId, productName, price, quantity) => {
  trackEvent('Ecommerce', 'Add to Cart', productName);
  
  // E-commerce specific event
  if (FEATURES?.ANALYTICS_ENABLED) {
    ReactGA.gtag('event', 'add_to_cart', {
      currency: 'IRR',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: quantity
      }]
    });
  }
};

/**
 * Track checkout steps
 * @param {number} step - Checkout step number
 * @param {string} option - Checkout option (e.g. shipping method)
 */
export const trackCheckout = (step, option) => {
  trackEvent('Checkout', 'Step', `Step ${step}: ${option}`);
  
  // E-commerce checkout step tracking
  if (FEATURES?.ANALYTICS_ENABLED) {
    ReactGA.gtag('event', 'begin_checkout', {
      checkout_step: step,
      checkout_option: option
    });
  }
};

/**
 * Track purchase completion
 * @param {string} transactionId - Transaction ID
 * @param {number} revenue - Total revenue
 * @param {Array} items - Purchased items
 */
export const trackPurchase = (transactionId, revenue, items) => {
  // E-commerce purchase tracking
  if (FEATURES?.ANALYTICS_ENABLED) {
    ReactGA.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: revenue,
      currency: 'IRR',
      items: items
    });
  }
};

/**
 * Track search queries
 * @param {string} searchTerm - Search term
 */
export const trackSearch = (searchTerm) => {
  trackEvent('Search', 'Query', searchTerm);
};

/**
 * Track user registration
 * @param {string} method - Registration method
 */
export const trackUserRegistration = (method) => {
  trackEvent('User', 'Signup', method);
};

/**
 * Track user login
 * @param {string} method - Login method
 */
export const trackUserLogin = (method) => {
  trackEvent('User', 'Login', method);
};

/**
 * Track error events
 * @param {string} category - Error category
 * @param {string} message - Error message
 */
export const trackError = (category, message) => {
  trackEvent('Error', category, message);
};

/**
 * Track filter usage
 * @param {string} filterType - Type of filter
 * @param {string} filterValue - Filter value
 */
export const trackFilterUse = (filterType, filterValue) => {
  trackEvent('Filter', filterType, filterValue);
};

/**
 * Track brand page views
 * @param {string|number} brandId - Brand ID
 * @param {string} brandName - Brand name
 */
export const trackBrandView = (brandId, brandName) => {
  trackEvent('Brand', 'View', brandName, brandId);
};

// Export analytics functions
const analytics = {
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackCheckout,
  trackPurchase,
  trackSearch,
  trackUserRegistration,
  trackUserLogin,
  trackError,
  trackFilterUse,
  trackBrandView,
  initialize: initializeGA,
  event: trackEvent
};

export default analytics; 