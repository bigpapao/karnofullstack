import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Autorenew as ReturnIcon,
  HeadsetMic as SupportPhoneIcon,
  Verified,
  LocalOffer,
  CheckCircle,
  Category,
  ShoppingCart
} from '@mui/icons-material';

const features = [
  {
    id: 1,
    title: 'قطعات اصلی ایرانی',
    description: 'ارائه قطعات اصلی و با کیفیت برای خودروهای سایپا، ایران خودرو، ام وی ام و بهمن موتور',
    icon: <CheckCircle sx={{ fontSize: 40 }} />,
    highlight: true,
  },
  {
    id: 2,
    title: 'قیمت مناسب',
    description: 'قیمت‌های رقابتی بدون مصالحه در کیفیت با توجه به شرایط اقتصادی',
    icon: <LocalOffer sx={{ fontSize: 40 }} />,
  },
  {
    id: 3,
    title: 'ارسال سریع',
    description: 'تحویل سریع به سراسر کشور با امکان پیگیری سفارش به صورت آنلاین',
    icon: <ShippingIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 4,
    title: 'ضمانت اصالت کالا',
    description: 'تمام محصولات ما اصل و دارای گارانتی بازگشت وجه در صورت عدم اصالت',
    icon: <Verified sx={{ fontSize: 40 }} />,
    highlight: true,
  },
  {
    id: 5,
    title: 'پشتیبانی تخصصی',
    description: 'تیم پشتیبانی متخصص آماده مشاوره و راهنمایی در انتخاب قطعات مناسب',
    icon: <SupportPhoneIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 6,
    title: 'تنوع قطعات خودروهای ایرانی',
    description: 'بیش از 50,000 قطعه برای تمام مدل‌های خودروهای ایرانی و خارجی',
    icon: <Category sx={{ fontSize: 40 }} />,
    highlight: true,
  },
  {
    id: 7,
    title: 'قطعات کمیاب',
    description: 'دسترسی به قطعات کمیاب و سخت‌یاب خودروهای ایرانی و خارجی',
    icon: <ReturnIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 8,
    title: 'امکان خرید آنلاین',
    description: 'خرید آسان و سریع با چند کلیک و پرداخت امن از طریق درگاه بانکی',
    icon: <ShoppingCart sx={{ fontSize: 40 }} />,
  },
];

const WhyChooseUs = () => {
  return (
    <Box
      className="why-choose-us"
      sx={{
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              direction: 'rtl',
            }}
          >
            چرا ما را انتخاب کنید
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{
              mb: 4,
              direction: 'rtl',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            ما به عنوان مرجع تخصصی قطعات خودروهای ایرانی، بهترین خدمات را به شما ارائه می‌دهیم
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              direction: 'rtl',
            }}
          >
            ما متعهد به ارائه بهترین تجربه خرید قطعات خودرو هستیم
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: feature.highlight ? 'primary.light' : 'background.paper',
                  color: feature.highlight ? 'white' : 'inherit',
                  borderRadius: 2,
                  boxShadow: feature.highlight ? 3 : 1,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                  },
                  '&::after': feature.highlight ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '0 40px 40px 0',
                    borderColor: 'transparent #f50057 transparent transparent',
                    zIndex: 1,
                  } : {},
                }}
              >
                <Box
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: 600, direction: 'rtl' }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ direction: 'rtl' }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Trust Badges */}
        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 500, direction: 'rtl' }}
          >
            مورد اعتماد هزاران مشتری
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            {[
              'امنیت SSL',
              'رضایت تضمین شده',
              'قطعات اصل',
              'پرداخت امن',
            ].map((badge, index) => (
              <Grid item key={index}>
                <Paper
                  sx={{
                    height: 60,
                    width: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    opacity: 0.7,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {badge}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
