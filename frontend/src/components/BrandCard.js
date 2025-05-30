import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  DateRange as DateIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const BrandCard = ({ brand }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        },
      }}
    >
      {brand.featured && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bgcolor: 'secondary.main',
            color: 'white',
            zIndex: 2,
            px: 1,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            borderBottomLeftRadius: 8,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <StarIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
          ویژه
        </Box>
      )}

      <CardActionArea
        component={RouterLink}
        to={`/brands/${brand.slug}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={brand.logo}
            alt={brand.name}
            sx={{
              objectFit: 'contain',
              bgcolor: 'background.paper',
              p: 2,
            }}
          />
          {brand.country && (
            <Chip
              label={brand.country}
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontSize: '0.7rem',
                direction: 'rtl',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          direction: 'rtl',
          p: 2,
        }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h3" 
            align="right" 
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            {brand.name}
          </Typography>
          
          {brand.description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                height: '4.5em',
                textAlign: 'right',
              }}
            >
              {brand.description}
            </Typography>
          )}
          
          {brand.establishedYear && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'right' }}>
                سال تأسیس:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DateIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.875rem' }} />
                <Typography variant="body2" fontWeight="medium">
                  {brand.establishedYear}
                </Typography>
              </Box>
            </Box>
          )}

          {brand.headquarters && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'right' }}>
                مقر اصلی:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.875rem' }} />
                <Typography variant="body2" fontWeight="medium">
                  {brand.headquarters}
                </Typography>
              </Box>
            </Box>
          )}
          
          {brand.popularModels && brand.popularModels.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, textAlign: 'right' }}>
                مدل‌های محبوب:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end' }}>
                {brand.popularModels.slice(0, 3).map((model, index) => (
                  <Chip
                    key={index}
                    label={model}
                    size="small"
                    variant="outlined"
                    sx={{ direction: 'rtl' }}
                  />
                ))}
                {brand.popularModels.length > 3 && (
                  <Chip
                    label={`+${brand.popularModels.length - 3}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                )}
              </Box>
            </Box>
          )}
          
          <Divider sx={{ my: 1.5 }} />
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto',
            }}
          >
            <Button 
              size="small" 
              color="primary" 
              sx={{ fontSize: '0.75rem' }}
            >
              مشاهده قطعات
            </Button>
            
            <Chip
              label={`${brand.partsCount} قطعه`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ direction: 'rtl' }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BrandCard;
