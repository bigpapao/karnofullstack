import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  alpha,
} from '@mui/material';
import { DirectionsCar as CarIcon, Search as SearchIcon } from '@mui/icons-material';
import SearchBar from './SearchBar';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Car brand data (no longer needing logos)
  const carBrands = [
    { name: 'سایپا', color: '#e53935', slug: 'saipa' },
    { name: 'ایران خودرو', color: '#1976d2', slug: 'irankhodro' },
    { name: 'ام وی ام', color: '#43a047', slug: 'mvm' },
    { name: 'بهمن موتور', color: '#7b1fa2', slug: 'bahmanmotor' },
  ];

  return (
    <Box
      className="hero-section"
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        color: 'white',
        pt: { xs: 8, md: 10 },
        pb: { xs: 10, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Abstract background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                direction: 'rtl',
              }}
            >
              مرجع تخصصی قطعات خودروهای ایرانی
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                opacity: 0.9,
                fontWeight: 400,
                direction: 'rtl',
              }}
            >
              قطعات اصل و با کیفیت برای انواع خودروهای داخلی
            </Typography>
            
            <Box 
              sx={{ 
                mb: 4, 
                backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                padding: 2, 
                borderRadius: 2, 
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <SearchBar />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm="auto">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  fullWidth={isMobile}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderRadius: '30px',
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    }
                  }}
                >
                  جستجوی قطعات
                </Button>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/brands')}
                  fullWidth={isMobile}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderRadius: '30px',
                    borderColor: 'white',
                    borderWidth: 2,
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 2,
                    },
                  }}
                >
                  مشاهده برندها
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
            }}
          >
            {/* New brand cards grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: 3,
              maxWidth: 500,
              width: '100%',
            }}>
              {carBrands.map((brand, index) => (
                <Paper
                  key={index}
                  elevation={4}
                  onClick={() => navigate(`/brands/${brand.slug}`)}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 8,
                      height: '50%',
                      backgroundColor: brand.color,
                      borderBottomRightRadius: 8,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(brand.color, 0.1),
                      color: brand.color,
                      mb: 1,
                    }}
                  >
                    <CarIcon sx={{ fontSize: 28 }} />
                  </Box>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    {brand.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
