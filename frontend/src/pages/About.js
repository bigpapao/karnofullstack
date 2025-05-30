import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { Build, LocalShipping, Security, Support } from '@mui/icons-material';
import SEO from '../components/SEO';
import { generateOrganizationSchema } from '../utils/structuredData';

const About = () => {
  const features = [
    {
      icon: <Build fontSize="large" />,
      title: 'Quality Parts',
      description: 'We offer only genuine and high-quality automotive parts from trusted manufacturers.',
    },
    {
      icon: <LocalShipping fontSize="large" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your parts delivered when you need them.',
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Secure Shopping',
      description: 'Your security is our priority. Shop with confidence using our secure platform.',
    },
    {
      icon: <Support fontSize="large" />,
      title: '24/7 Support',
      description: 'Our customer support team is always ready to help you with any questions.',
    },
  ];

  // Generate organization schema for structured data
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <SEO
        title="درباره ما | کارنو - فروشگاه اینترنتی قطعات خودرو"
        description="درباره فروشگاه اینترنتی کارنو، تامین کننده قطعات یدکی و لوازم جانبی خودرو با کیفیت و تضمین اصالت. تاریخچه، ماموریت و چشم انداز ما."
        canonical="https://karno.ir/about"
        openGraph={{
          type: 'website',
          title: 'درباره ما | کارنو - فروشگاه اینترنتی قطعات خودرو',
          description: 'درباره فروشگاه اینترنتی کارنو، تامین کننده قطعات یدکی و لوازم جانبی خودرو با کیفیت و تضمین اصالت. تاریخچه، ماموریت و چشم انداز ما.',
          url: 'https://karno.ir/about',
          image: 'https://karno.ir/images/about-og.jpg',
        }}
        schema={organizationSchema}
      />
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About KARNO
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph align="center" sx={{ mb: 6 }}>
          Your trusted source for quality automotive parts and accessories
        </Typography>

        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            KARNO was founded with a simple mission: to provide car enthusiasts and
            mechanics with easy access to high-quality automotive parts. We understand
            the importance of reliable parts in keeping vehicles running smoothly and
            safely.
          </Typography>
          <Typography variant="body1" paragraph>
            With years of experience in the automotive industry, we've built strong
            relationships with leading manufacturers to bring you the best selection
            of parts at competitive prices.
          </Typography>
        </Box>

        <Typography variant="h4" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.default',
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
    </>
  );
};

export default About;
