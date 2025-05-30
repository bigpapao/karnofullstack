import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  ZoomIn,
  Close,
} from '@mui/icons-material';

const ProductImageGallery = ({ images }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const toggleZoom = () => {
    setZoomOpen(!zoomOpen);
  };

  return (
    <Box>
      {/* Main Image */}
      <Paper
        sx={{
          position: 'relative',
          mb: 2,
          overflow: 'hidden',
          cursor: 'zoom-in',
        }}
      >
        <Box
          component="img"
          src={images[selectedImage]?.url || images[selectedImage]}
          alt={images[selectedImage]?.alt || `Product image ${selectedImage + 1}`}
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={toggleZoom}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }}
              onClick={handlePrevImage}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }}
              onClick={handleNextImage}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}

        {/* Zoom Icon */}
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
          }}
          onClick={toggleZoom}
        >
          <ZoomIn />
        </IconButton>
      </Paper>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'background.paper',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'primary.main',
              borderRadius: 3,
            },
          }}
        >
          {images.map((image, index) => (
            <Paper
              key={index}
              elevation={selectedImage === index ? 4 : 1}
              sx={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                flexShrink: 0,
                cursor: 'pointer',
                border: selectedImage === index ? 2 : 0,
                borderColor: 'primary.main',
                overflow: 'hidden',
              }}
              onClick={() => handleThumbnailClick(index)}
            >
              <Box
                component="img"
                src={image?.url || image}
                alt={image?.alt || `Thumbnail ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          ))}
        </Box>
      )}

      {/* Zoom Dialog */}
      <Dialog
        open={zoomOpen}
        onClose={toggleZoom}
        maxWidth="xl"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'background.default',
          },
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton
            onClick={toggleZoom}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <Close />
          </IconButton>
          <Box
            component="img"
            src={images[selectedImage]?.url || images[selectedImage]}
            alt={images[selectedImage]?.alt || `Product image ${selectedImage + 1}`}
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductImageGallery;
