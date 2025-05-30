import { useCallback } from 'react';
import { 
  trackEvent, 
  trackProductView as trackProductViewUtil, 
  trackAddToCart as trackAddToCartUtil, 
  trackSearch as trackSearchUtil,
  trackCheckout,
  trackUserLogin,
  trackUserRegistration
} from '../utils/analytics';

/**
 * Custom hook for tracking events in Google Analytics
 * 
 * Provides easy access to tracking functions in any component
 */
const useTracking = () => {
  // Track a basic event
  const trackAction = useCallback((category, action, label, value) => {
    trackEvent(category, action, label, value);
  }, []);
  
  // Track a product view
  const trackProductView = useCallback((productId, productName, price) => {
    trackProductViewUtil(productId, productName, price);
  }, []);
  
  // Track add to cart
  const trackAddToCart = useCallback((productId, productName, price, quantity) => {
    trackAddToCartUtil(productId, productName, price, quantity);
  }, []);
  
  // Track a search query
  const trackSearch = useCallback((searchTerm) => {
    trackSearchUtil(searchTerm);
  }, []);
  
  // Track checkout steps
  const trackCheckoutStep = useCallback((step, option) => {
    trackCheckout(step, option);
  }, []);
  
  // Track user authentication
  const trackAuth = useCallback((type, method) => {
    if (type === 'login') {
      trackUserLogin(method);
    } else if (type === 'signup') {
      trackUserRegistration(method);
    }
  }, []);
  
  // Track outbound links
  const trackLink = useCallback((url) => {
    trackEvent('Outbound', 'Click', url);
    
    // If it's an external link that opens in same window, delay navigation
    if (url.startsWith('http') && !url.includes(window.location.hostname)) {
      setTimeout(() => {
        window.location.href = url;
      }, 200);
      return false;
    }
    return true;
  }, []);
  
  return {
    trackAction,
    trackProductView,
    trackAddToCart,
    trackSearch,
    trackCheckoutStep,
    trackAuth,
    trackLink
  };
};

export default useTracking; 