import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree.
 * It logs errors and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Optional: send to analytics or error tracking service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        'description': `${error.toString()} | ${errorInfo.componentStack}`,
        'fatal': true
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper 
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: '#ffefef',
              border: '1px solid #ffcfcf'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom color="error">
              متأسفانه مشکلی پیش آمده است
            </Typography>
            
            <Box sx={{ my: 4 }}>
              <Typography variant="body1" paragraph align="center">
                با عرض پوزش، در اجرای این بخش از برنامه خطایی رخ داده است. لطفاً صفحه را دوباره بارگذاری کنید یا به صفحه اصلی بازگردید.
              </Typography>

              {process.env.NODE_ENV !== 'production' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'left', direction: 'ltr' }}>
                  <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                    Error Details (Developer Mode Only):
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '200px' }}>
                    {this.state.error && this.state.error.toString()}
                  </Typography>
                  
                  {this.state.errorInfo && (
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '200px', mt: 2, fontSize: '0.75rem' }}>
                      Component Stack: {this.state.errorInfo.componentStack}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/"
              >
                بازگشت به صفحه اصلی
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => window.location.reload()}
              >
                بارگذاری مجدد صفحه
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary; 