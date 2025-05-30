import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from './ProductCard';

const RelatedProducts = ({ category, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch related products from API
    // For now, using mock data
    const mockProducts = [
      {
        id: 1,
        name: 'Premium Brake Pads',
        price: 79.99,
        image: '/images/products/brake-pads.jpg',
        rating: 4.5,
        reviewCount: 128,
      },
      {
        id: 2,
        name: 'High-Performance Oil Filter',
        price: 24.99,
        image: '/images/products/oil-filter.jpg',
        rating: 4.8,
        reviewCount: 95,
      },
      {
        id: 3,
        name: 'LED Headlight Kit',
        price: 199.99,
        image: '/images/products/headlight.jpg',
        rating: 4.7,
        reviewCount: 67,
      },
      {
        id: 4,
        name: 'Air Intake System',
        price: 149.99,
        image: '/images/products/air-intake.jpg',
        rating: 4.6,
        reviewCount: 42,
      },
      {
        id: 5,
        name: 'Performance Spark Plugs',
        price: 34.99,
        image: '/images/products/spark-plugs.jpg',
        rating: 4.4,
        reviewCount: 89,
      },
    ].filter(product => product.id !== currentProductId);

    setProducts(mockProducts);
    setLoading(false);
  }, [category, currentProductId]);

  if (loading) {
    return null;
  }

  if (products.length === 0) {
    return (
      <Typography color="text.secondary" align="center">
        No related products found
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
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

export default RelatedProducts;
