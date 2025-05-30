import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardActionArea,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { DirectionsCar as CarIcon } from '@mui/icons-material';

const iranianBrands = [
  {
    id: 1,
    name: 'سایپا',
    slug: 'saipa',
    color: '#e53935', // red
    desc: 'تولید کننده خودروهای کوییک، تیبا و پراید',
  },
  {
    id: 2,
    name: 'ایران خودرو',
    slug: 'irankhodro',
    color: '#1976d2', // blue
    desc: 'تولید کننده خودروهای پژو، سمند و دنا',
  },
  {
    id: 3,
    name: 'ام وی ام',
    slug: 'mvm',
    color: '#43a047', // green
    desc: 'تولید کننده خودروهای کراس‌اوور و سدان',
  },
  {
    id: 4,
    name: 'بهمن موتور',
    slug: 'bahmanmotor',
    color: '#7b1fa2', // purple
    desc: 'تولید کننده خودروهای دیگنیتی و فیدلیتی',
  },
];

const FeaturedBrands = () => {
  const navigate = useNavigate();

  return (
    <Box
      className="featured-brands"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: 'rgba(232, 244, 253, 0.6)',
        borderRadius: '16px',
        mx: { xs: 2, md: 4 },
        my: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -70,
          right: -70,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: alpha('#4fc3f7', 0.2),
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          backgroundColor: alpha('#4fc3f7', 0.15),
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              direction: 'rtl',
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
            }}
          >
            قطعات اصلی خودروهای ایرانی
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ direction: 'rtl', mb: 3, maxWidth: '800px', mx: 'auto' }}
          >
            ارائه قطعات کمیاب و اصل برای تمامی مدل‌های خودروهای ایرانی
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {iranianBrands.map((brand) => (
            <Grid item key={brand.id} xs={12} sm={6} md={3}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: alpha(brand.color, 0.2),
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 20px -8px ${alpha(brand.color, 0.25)}`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/brands/${brand.slug}`)}
                  sx={{ height: '100%' }}
                >
                  <Box 
                    sx={{
                      position: 'relative',
                      height: '100%',
                      padding: 3,
                      background: `linear-gradient(135deg, white 50%, ${alpha(brand.color, 0.08)} 100%)`,
                    }}
                  >
                    {/* Brand Icon */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${brand.color} 0%, ${alpha(brand.color, 0.7)} 100%)`,
                        color: 'white',
                        mb: 2,
                      }}
                    >
                      <CarIcon />
                    </Box>
                    
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ 
                        direction: 'rtl', 
                        fontWeight: 700,
                        color: brand.color,
                      }}
                    >
                      {brand.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{ 
                        direction: 'rtl',
                        color: 'text.secondary',
                        height: '2.5em',
                        overflow: 'hidden',
                      }}
                    >
                      {brand.desc}
                    </Typography>
                    
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: alpha(brand.color, 0.2),
                        textAlign: 'right',
                      }}
                    >
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ 
                          color: brand.color,
                          fontWeight: 500,
                        }}
                      >
                        مشاهده قطعات ›
                      </Typography>
                    </Box>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 5,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/brands')}
            sx={{ 
              borderRadius: '30px',
              px: 4,
              py: 1,
              fontWeight: 600,
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.35)',
              },
            }}
          >
            مشاهده همه برندها
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedBrands;
