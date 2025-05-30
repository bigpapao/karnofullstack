import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              کارنو
            </Typography>
            <Typography variant="body2" color="text.secondary">
              فروشگاه آنلاین قطعات و لوازم یدکی خودرو با کیفیت بالا و قیمت مناسب
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="فیسبوک" size="small">
                <Facebook className="no-flip" />
              </IconButton>
              <IconButton color="primary" aria-label="توییتر" size="small">
                <Twitter className="no-flip" />
              </IconButton>
              <IconButton color="primary" aria-label="اینستاگرام" size="small">
                <Instagram className="no-flip" />
              </IconButton>
              <IconButton color="primary" aria-label="لینکدین" size="small">
                <LinkedIn className="no-flip" />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              دسترسی سریع
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/products"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                محصولات
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                درباره ما
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                تماس با ما
              </Link>
              <Link
                component={RouterLink}
                to="/blog"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                وبلاگ
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              خدمات مشتریان
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/shipping"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                اطلاعات ارسال
              </Link>
              <Link
                component={RouterLink}
                to="/returns"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                مرجوعی کالا
              </Link>
              <Link
                component={RouterLink}
                to="/faq"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                سوالات متداول
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                color="text.secondary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                شرایط و قوانین
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              تماس با ما
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn color="action" sx={{ ml: 1 }} className="no-flip" />
                <Typography variant="body2" color="text.secondary">
                  تهران، خیابان ولیعصر
                  <br />
                  پلاک ۱۲۳، واحد ۴۵
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone color="action" sx={{ ml: 1 }} className="no-flip" />
                <Typography variant="body2" color="text.secondary">
                  تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email color="action" sx={{ ml: 1 }} className="no-flip" />
                <Typography variant="body2" color="text.secondary">
                  ایمیل: info@karno.ir
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 2 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} کارنو. تمامی حقوق محفوظ است.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
