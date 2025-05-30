import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';

const categories = [
  {
    id: 1,
    title: 'قطعات موتور',
    description: 'قطعات موتور اصلی برای خودروهای سایپا، ایران خودرو و سایر برندها',
    image: '/images/categories/engine.jpg',
    link: '/products?category=engine',
    icon: 'Engine',
    featured: true,
  },
  {
    id: 2,
    title: 'سیستم ترمز',
    description: 'لنت ترمز، دیسک، کالیپر و سایر قطعات ترمز با کیفیت بالا',
    image: '/images/categories/brakes.jpg',
    link: '/products?category=brakes',
    icon: 'Brakes',
  },
  {
    id: 3,
    title: 'سیستم تعلیق',
    description: 'کمک فنر، فنر، سیبک و سایر قطعات تعلیق برای خودروهای ایرانی',
    image: '/images/categories/suspension.jpg',
    link: '/products?category=suspension',
    icon: 'Suspension',
    featured: true,
  },
  {
    id: 4,
    title: 'قطعات گیربکس',
    description: 'انواع قطعات گیربکس دستی و اتوماتیک برای خودروهای ایرانی و خارجی',
    image: '/images/categories/transmission.jpg',
    link: '/products?category=transmission',
    icon: 'Transmission',
  },
  {
    id: 5,
    title: 'قطعات برقی',
    description: 'استارت، دینام، باتری و سایر قطعات الکتریکی برای تمام مدل‌ها',
    image: '/images/categories/electrical.jpg',
    link: '/products?category=electrical',
    icon: 'Electrical',
  },
  {
    id: 6,
    title: 'قطعات بدنه',
    description: 'سپر، آینه، چراغ و سایر قطعات بدنه با کیفیت برای خودروهای ایرانی',
    image: '/images/categories/body.jpg',
    link: '/products?category=body',
    icon: 'Body',
    featured: true,
  },
  {
    id: 7,
    title: 'فیلترها',
    description: 'فیلتر روغن، هوا، بنزین و کابین برای تمامی مدل‌های خودرو',
    image: '/images/categories/filters.jpg',
    link: '/products?category=filters',
    icon: 'Filters',
  },
  {
    id: 8,
    title: 'لوازم یدکی پرمصرف',
    description: 'قطعات پرمصرف و مورد نیاز برای سرویس دوره‌ای خودرو',
    image: '/images/categories/maintenance.jpg',
    link: '/products?category=maintenance',
    icon: 'Maintenance',
  },
];

const FeaturedCategories = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg" className="featured-products">
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
          دسته‌بندی قطعات خودروهای ایرانی
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
          بهترین قطعات اصلی و با کیفیت برای خودروهای سایپا، ایران خودرو، ام وی ام و بهمن موتور
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(category.link)}
                  sx={{ flexGrow: 1 }}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: category.featured ? '#f50057' : (category.id % 2 === 0 ? '#2196f3' : '#1976d2'),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': category.featured ? {
                        content: '"\u067eرطرفدار"',
                        position: 'absolute',
                        top: 10,
                        right: -30,
                        transform: 'rotate(45deg)',
                        padding: '2px 30px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                      } : {},
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h5" color="white">
                        {category.icon && category.icon.charAt(0)}
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="white" align="center">
                      {category.title}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      sx={{ fontWeight: 600, direction: 'rtl' }}
                    >
                      {category.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, direction: 'rtl' }}
                    >
                      {category.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&::after': {
                          content: '"→"',
                          marginLeft: '4px',
                          transition: 'transform 0.2s',
                        },
                        '&:hover::after': {
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      مشاهده دسته‌بندی
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedCategories;
