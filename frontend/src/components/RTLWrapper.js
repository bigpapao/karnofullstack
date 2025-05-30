import React, { useEffect } from 'react';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DirectionProvider } from '../contexts/DirectionContext';
import { loadOptimizedPersianFonts } from '../utils/fontOptimizer';

// Create RTL cache
const cacheRTL = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Sample Persian text for font optimization
const SAMPLE_PERSIAN_TEXT = 'آبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹';

/**
 * RTLWrapper component
 * 
 * Configures the application for RTL support and optimizes Persian font loading
 * Always sets the direction to RTL for Iranian customers
 */
const RTLWrapper = ({ children }) => {
  // Always use RTL for Persian website
  const direction = 'rtl';
  
  // Generate theme with RTL direction
  const theme = createTheme({
    direction,
    typography: {
      fontFamily: 'Vazirmatn, Roboto, Arial, sans-serif',
    },
  });
  
  // Set up RTL and font optimization
  useEffect(() => {
    // Set document direction
    document.dir = direction;
    document.documentElement.setAttribute('lang', 'fa');
    
    // Load optimized Persian fonts with a slight delay to ensure it doesn't block rendering
    try {
      setTimeout(() => {
        loadOptimizedPersianFonts(SAMPLE_PERSIAN_TEXT);
      }, 100);
    } catch (error) {
      console.error('Failed to load optimized fonts:', error);
      // Ensure we have a fallback font if optimization fails
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap';
      document.head.appendChild(link);
    }
  }, [direction]);
  
  return (
    <CacheProvider value={cacheRTL}>
      <ThemeProvider theme={theme}>
        <DirectionProvider initialDirection={direction}>
          {children}
        </DirectionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default RTLWrapper; 