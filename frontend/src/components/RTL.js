import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// RTL theme with Persian settings
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2C3E50',
      light: '#34495E',
      dark: '#1A252F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E74C3C',
      light: '#FF6B6B',
      dark: '#C0392B',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#3498DB', // Bright blue for highlights
      light: '#5DADE2',
      dark: '#2980B9',
    },
    success: {
      main: '#2ECC71',
      light: '#A9DFBF',
      dark: '#27AE60',
    },
    warning: {
      main: '#F1C40F',
      light: '#F7DC6F',
      dark: '#F39C12',
    },
    error: {
      main: '#E74C3C',
      light: '#F1948A',
      dark: '#C0392B',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
      dark: '#2C3E50',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      disabled: '#BDC3C7',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'cta' },
          style: {
            backgroundColor: '#E74C3C',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#C0392B',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2C3E50',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2C3E50',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    // RTL specific component overrides
    MuiInputLabel: {
      styleOverrides: {
        root: {
          right: 20,
          left: 'auto',
          transformOrigin: 'top right',
        },
      },
    },
  },
});

/**
 * RTL component for Persian language content with right-to-left text direction
 */
export const RTL = ({ children }) => {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default RTL;
