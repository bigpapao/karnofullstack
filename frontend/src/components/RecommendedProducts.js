import React, { useEffect, useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import ProductCard from './ProductCard';

const RecommendedProducts = ({ title = 'محصولات پیشنهادی', limit = 5 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch from an API
    // For now, using mock data
    const fetchRecommendedProducts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockProducts = [
          {
            id: 1,
            name: 'روغن موتور سینتتیک',
            price: 899.99,
            image: 'https://via.placeholder.com/300x200?text=Engine+Oil',
            rating: 4.9,
            reviewCount: 156,
            discount: 10,
            inStock: true,
          },
          {
            id: 2,
            name: 'فیلتر روغن اصلی',
            price: 249.99,
            image: 'https://via.placeholder.com/300x200?text=Oil+Filter',
            rating: 4.8,
            reviewCount: 95,
            discount: 0,
            inStock: true,
          },
          {
            id: 3,
            name: 'کیت چراغ جلو LED',
            price: 1999.99,
            image: 'https://via.placeholder.com/300x200?text=LED+Headlight',
            rating: 4.7,
            reviewCount: 67,
            discount: 15,
            inStock: true,
          },
          {
            id: 4,
            name: 'سیستم ورودی هوا',
            price: 1499.99,
            image: 'https://via.placeholder.com/300x200?text=Air+Intake',
            rating: 4.6,
            reviewCount: 42,
            discount: 0,
            inStock: true,
          },
          {
            id: 5,
            name: 'شمع موتور عملکرد بالا',
            price: 349.99,
            image: 'https://via.placeholder.com/300x200?text=Spark+Plugs',
            rating: 4.4,
            reviewCount: 89,
            discount: 5,
            inStock: true,
          },
          {
            id: 6,
            name: 'روکش صندلی چرمی',
            price: 2499.99,
            image: 'https://via.placeholder.com/300x200?text=Seat+Cover',
            rating: 4.3,
            reviewCount: 37,
            discount: 0,
            inStock: true,
          },
        ].slice(0, limit);

        setProducts(mockProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [limit]);

  // Loading skeletons
  if (loading) {
    return (
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'right' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden' }}>
          {[...Array(4)].map((_, index) => (
            <Box key={index} sx={{ width: 280, flexShrink: 0 }}>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 1, borderRadius: 1 }} />
              <Skeleton width="80%" height={28} sx={{ mb: 1 }} />
              <Skeleton width="60%" height={24} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'right' }}>
        {title}
      </Typography>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          600: {
            slidesPerView: 2,
          },
          960: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        style={{
          paddingBottom: '40px', // Space for pagination dots
          direction: 'ltr', // For proper navigation button placement
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default RecommendedProducts;
