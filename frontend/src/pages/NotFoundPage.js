import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Custom 404 Not Found page that displays when users navigate to non-existent routes.
 * It includes links to help users navigate back to the main parts of the application.
 */
const NotFoundPage = () => {
  const location = useLocation();
  
  // Recommended routes to help users navigate back
  const recommendedRoutes = [
    { path: '/', label: 'صفحه اصلی', icon: <HomeIcon /> },
    { path: '/products', label: 'محصولات', icon: <SearchIcon /> },
    { path: '/cart', label: 'سبد خرید', icon: null }
  ];
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Large 404 number in the background */}
        <Typography
          variant="h1"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: { xs: '100px', md: '180px' },
            fontWeight: 900,
            color: '#f5f5f5',
            opacity: 0.6,
            zIndex: 0,
            userSelect: 'none'
          }}
        >
          404
        </Typography>
        
        <Box position="relative" zIndex={1}>
          <ErrorOutlineIcon 
            color="error" 
            sx={{ fontSize: 60, mb: 2 }} 
          />
          
          <Typography variant="h4" component="h1" gutterBottom>
            صفحه مورد نظر یافت نشد
          </Typography>
          
          <Typography variant="body1" paragraph>
            متأسفانه صفحه‌ای که به دنبال آن هستید پیدا نشد. آدرس وارد شده:
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              direction: 'ltr', 
              bgcolor: '#f5f5f5', 
              p: 1, 
              borderRadius: 1, 
              display: 'inline-block',
              mb: 3 
            }}
          >
            {location.pathname}
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="subtitle1" mb={2}>
              شاید یکی از این صفحات مقصد شما باشد:
            </Typography>
            
            <Grid container spacing={2} justifyContent="center">
              {recommendedRoutes.map((route) => (
                <Grid item key={route.path}>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={route.path}
                    startIcon={route.icon}
                  >
                    {route.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box sx={{ mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/"
              size="large"
            >
              بازگشت به صفحه اصلی
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage; 