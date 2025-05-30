import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
} from '@mui/material';

const Blog = () => {
  // Mock data - replace with actual API call
  const posts = [
    {
      id: 1,
      slug: 'essential-car-maintenance-tips',
      title: 'Essential Car Maintenance Tips for Every Driver',
      excerpt: 'Learn the basic maintenance tasks that every car owner should know to keep their vehicle running smoothly.',
      image: 'https://source.unsplash.com/800x400/?car-maintenance',
      date: '2025-05-09',
      category: 'Maintenance',
      readTime: '5 min read',
    },
    {
      id: 2,
      slug: 'choosing-right-brake-pads',
      title: 'How to Choose the Right Brake Pads for Your Vehicle',
      excerpt: 'A comprehensive guide to selecting the perfect brake pads based on your driving style and vehicle type.',
      image: 'https://source.unsplash.com/800x400/?brake',
      date: '2025-05-08',
      category: 'Parts Guide',
      readTime: '7 min read',
    },
    {
      id: 3,
      slug: 'electric-car-maintenance',
      title: 'Electric Car Maintenance: What You Need to Know',
      excerpt: 'Discover the unique maintenance requirements of electric vehicles and how they differ from traditional cars.',
      image: 'https://source.unsplash.com/800x400/?electric-car',
      date: '2025-05-07',
      category: 'Electric Vehicles',
      readTime: '6 min read',
    },
    {
      id: 4,
      slug: 'summer-driving-tips',
      title: 'Summer Driving Tips: Keep Your Car Cool',
      excerpt: 'Essential tips to maintain your car\'s performance and comfort during the hot summer months.',
      image: 'https://source.unsplash.com/800x400/?summer-car',
      date: '2025-05-06',
      category: 'Seasonal Tips',
      readTime: '4 min read',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Auto Care Blog
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          align="center"
          sx={{ mb: 6 }}
        >
          Expert advice, tips, and insights for car enthusiasts
        </Typography>

        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={post.image}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Chip
                      label={post.category}
                      size="small"
                      color="primary"
                      sx={{ borderRadius: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {post.readTime}
                    </Typography>
                  </Stack>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    paragraph
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      component={RouterLink}
                      to={`/blog/${post.slug}`}
                      variant="outlined"
                      size="small"
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Blog;
