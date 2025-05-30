import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  Paper,
  Avatar,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const BlogPost = () => {
  const { slug } = useParams();

  // Mock data - replace with actual API call based on slug
  const post = {
    title: 'Essential Car Maintenance Tips for Every Driver',
    date: '2025-05-09',
    author: {
      name: 'John Smith',
      avatar: 'https://source.unsplash.com/100x100/?portrait',
      role: 'Automotive Expert',
    },
    category: 'Maintenance',
    readTime: '5 min read',
    image: 'https://source.unsplash.com/1200x600/?car-maintenance',
    content: `Regular car maintenance is crucial for keeping your vehicle running smoothly and avoiding costly repairs down the road. Here are some essential maintenance tips that every driver should know:

1. Check Your Oil Regularly
Your car's engine oil is its lifeblood. Check the oil level at least once a month and change it according to your manufacturer's recommendations. Most modern cars need oil changes every 5,000 to 7,500 miles.

2. Monitor Tire Pressure
Proper tire pressure is essential for safety, fuel efficiency, and tire longevity. Check your tire pressure at least once a month and before long trips. The recommended pressure can usually be found on a sticker inside the driver's door frame.

3. Replace Windshield Wipers
Good visibility is crucial for safe driving. Replace your windshield wipers every 6-12 months or when you notice signs of wear, such as streaking or skipping.

4. Check Brake Pads
Listen for any squealing or grinding noises when braking. Have your brake pads inspected regularly and replace them when they get too thin. Most brake pads need replacement every 30,000 to 70,000 miles.

5. Keep Up with Fluid Levels
Regularly check and top up these essential fluids:
• Engine oil
• Coolant
• Brake fluid
• Power steering fluid
• Windshield washer fluid
• Transmission fluid

6. Pay Attention to Warning Lights
Don't ignore dashboard warning lights. They're your car's way of telling you something needs attention. Have any warning lights checked by a professional as soon as possible.

7. Follow the Maintenance Schedule
Your owner's manual includes a maintenance schedule specific to your vehicle. Following this schedule helps prevent problems and maintains your warranty coverage.

Remember, prevention is always better (and cheaper) than cure when it comes to car maintenance. If you're unsure about any maintenance tasks, don't hesitate to consult a professional mechanic.`,
    relatedPosts: [
      {
        id: 2,
        title: 'How to Choose the Right Brake Pads',
        slug: 'choosing-right-brake-pads',
        image: 'https://source.unsplash.com/400x200/?brake',
      },
      {
        id: 3,
        title: 'Electric Car Maintenance Guide',
        slug: 'electric-car-maintenance',
        image: 'https://source.unsplash.com/400x200/?electric-car',
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Button
          component={RouterLink}
          to="/blog"
          startIcon={<ArrowBack />}
          sx={{ mb: 4 }}
        >
          Back to Blog
        </Button>

        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={post.author.avatar}
            alt={post.author.name}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="subtitle1">{post.author.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.author.role}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              {post.date}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip
                label={post.category}
                size="small"
                color="primary"
                sx={{ borderRadius: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {post.readTime}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          component="img"
          src={post.image}
          alt={post.title}
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 4,
          }}
        />

        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography
            variant="body1"
            component="div"
            sx={{
              '& p': {
                mb: 2,
              },
              whiteSpace: 'pre-line',
            }}
          >
            {post.content}
          </Typography>
        </Paper>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Related Posts
          </Typography>
          <Grid container spacing={3}>
            {post.relatedPosts.map((relatedPost) => (
              <Grid item xs={12} sm={6} key={relatedPost.id}>
                <Paper
                  component={RouterLink}
                  to={`/blog/${relatedPost.slug}`}
                  sx={{
                    display: 'flex',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    sx={{ width: 160, height: 120, objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      color="text.primary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {relatedPost.title}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogPost;
