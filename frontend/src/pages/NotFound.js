import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import BuildIcon from '@mui/icons-material/Build';
import SEO from '../components/SEO';

/**
 * 404 Not Found page with SEO optimization
 * This page helps to reduce bounce rate by providing navigation options
 */
const NotFound = () => {
  return (
    <>
      <SEO
        title="صفحه مورد نظر یافت نشد | کارنو"
        description="متاسفانه صفحه مورد نظر شما در فروشگاه اینترنتی کارنو یافت نشد. لطفا به صفحه اصلی بازگردید یا از منوی اصلی برای جستجوی محصولات استفاده کنید."
        canonical="https://karno.ir/404"
        noindex={true}
      />
      <Container maxWidth="md">
        <Box 
          sx={{ 
            py: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              bgcolor: 'background.paper',
              maxWidth: 600,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ color: 'primary.main', mb: 2, fontSize: 120 }}>
              <BuildIcon fontSize="inherit" color="primary" sx={{ opacity: 0.7 }} />
            </Box>
            
            <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 'bold', mb: 2 }}>
              404
            </Typography>
            
            <Typography variant="h4" gutterBottom sx={{ direction: 'rtl' }}>
              صفحه مورد نظر یافت نشد
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4, direction: 'rtl', maxWidth: 450 }}
            >
              متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/"
                size="large"
              >
                بازگشت به صفحه اصلی
              </Button>
              
              <Button 
                variant="outlined"
                color="primary"
                component={Link}
                to="/products"
                size="large"
              >
                مشاهده محصولات
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default NotFound;
