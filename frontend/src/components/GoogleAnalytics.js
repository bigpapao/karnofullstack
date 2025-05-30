import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeGA, trackPageView } from '../utils/analytics';
import { FEATURES } from '../utils/config';

/**
 * Google Analytics component
 * 
 * This component initializes Google Analytics and tracks page views
 * automatically when the route changes. It should be included once at the
 * application root level.
 * 
 * @param {Object} props
 * @param {boolean} props.debug - Whether to enable debug mode for GA
 */
const GoogleAnalytics = ({ debug = false }) => {
  const location = useLocation();
  
  // Initialize Google Analytics once when the component mounts
  useEffect(() => {
    if (FEATURES.ANALYTICS_ENABLED) {
      try {
        initializeGA(debug);
      } catch (error) {
        console.error('Failed to initialize Google Analytics:', error);
      }
    }
  }, [debug]);
  
  // Track page views whenever the location changes
  useEffect(() => {
    if (FEATURES.ANALYTICS_ENABLED && location) {
      try {
        const { pathname, search } = location;
        const page = pathname + search;
        const title = document.title;
        
        // Track the page view
        trackPageView(page, title);
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    }
  }, [location]);
  
  // This component doesn't render anything
  return null;
};

export default GoogleAnalytics; 