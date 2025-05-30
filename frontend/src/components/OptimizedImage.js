import React, { memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Box, Skeleton } from '@mui/material';

/**
 * Optimized image component with lazy loading, placeholder, and responsive behavior
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Main image source
 * @param {string} props.alt - Image alt text
 * @param {string} props.placeholderSrc - Small placeholder image (optional)
 * @param {string} props.srcSet - Responsive srcSet attribute
 * @param {string} props.sizes - Responsive sizes attribute
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.effect - Loading effect (blur, opacity, black-and-white)
 * @param {Object} props.imageStyle - Additional style for the image
 * @param {Object} props.wrapperStyle - Additional style for the wrapper
 * @param {Object} props.rootMargin - Root margin for intersection observer
 * @param {Function} props.afterLoad - Callback after image loads
 * @param {Function} props.beforeLoad - Callback before image loads
 * @param {boolean} props.aspectRatio - If true, maintain aspect ratio based on width/height
 */
const OptimizedImage = ({
  src,
  alt,
  placeholderSrc,
  srcSet,
  sizes,
  width,
  height,
  effect = 'blur',
  imageStyle = {},
  wrapperStyle = {},
  rootMargin = '50px 0px',
  afterLoad,
  beforeLoad,
  aspectRatio = true,
  ...props
}) => {
  // Calculate aspect ratio if needed
  const aspectRatioValue = aspectRatio && width && height 
    ? { paddingTop: `${(height / width) * 100}%` }
    : {};

  return (
    <Box
      position="relative"
      overflow="hidden"
      width={width ? `${width}px` : '100%'}
      height={height && !aspectRatio ? `${height}px` : 'auto'}
      style={{
        ...wrapperStyle,
        ...aspectRatioValue
      }}
      {...props}
    >
      <LazyLoadImage
        src={src}
        alt={alt || 'کارنو'}
        effect={effect}
        placeholderSrc={placeholderSrc}
        srcSet={srcSet}
        sizes={sizes || "(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"}
        threshold={100}
        placeholder={
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            animation="wave" 
          />
        }
        width={width || '100%'}
        height={height || 'auto'}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: aspectRatio ? '100%' : 'auto',
          position: aspectRatio ? 'absolute' : 'relative',
          top: aspectRatio ? 0 : 'auto',
          left: aspectRatio ? 0 : 'auto',
          ...imageStyle
        }}
        wrapperProps={{
          style: {
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'relative'
          }
        }}
        rootMargin={rootMargin}
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
      />
    </Box>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(OptimizedImage);

/**
 * Usage examples:
 * 
 * Basic usage:
 * <OptimizedImage src="/images/product.jpg" alt="Product Image" width={300} height={200} />
 * 
 * Responsive images:
 * <OptimizedImage 
 *   src="/images/product-large.jpg"
 *   srcSet="/images/product-small.jpg 500w, /images/product-medium.jpg 1000w, /images/product-large.jpg 1500w"
 *   sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
 *   alt="Product Image"
 * />
 * 
 * With placeholder:
 * <OptimizedImage 
 *   src="/images/product-large.jpg"
 *   placeholderSrc="/images/product-tiny.jpg"
 *   alt="Product Image"
 *   width={300}
 *   height={200}
 * />
 * 
 * Custom styles:
 * <OptimizedImage 
 *   src="/images/product.jpg"
 *   alt="Product Image"
 *   width={300}
 *   height={200}
 *   imageStyle={{ borderRadius: '8px' }}
 *   wrapperStyle={{ margin: '10px' }}
 * />
 */ 