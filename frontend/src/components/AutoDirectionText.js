import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import { getTextDirection, getTextDirectionStyle } from '../utils/directionUtils';

/**
 * Auto Direction Text Component
 * 
 * Automatically detects and applies the appropriate text direction (RTL/LTR)
 * based on the content, even for mixed-language content within an RTL layout.
 * 
 * @param {Object} props
 * @param {string} props.text - The text to display
 * @param {React.ElementType} props.component - The component to render (default: span)
 * @param {string} props.variant - MUI typography variant
 * @param {Object} props.sx - Additional MUI sx props
 * @param {Object} props.typographyProps - Additional props for Typography component
 */
const AutoDirectionText = ({
  text,
  component = 'span',
  variant,
  sx = {},
  typographyProps = {},
  ...rest
}) => {
  // Determine text direction
  const textDirection = useMemo(() => getTextDirection(text), [text]);
  
  // Get styles based on text direction
  const directionStyles = useMemo(() => getTextDirectionStyle(text), [text]);
  
  return (
    <Box
      component={component}
      dir={textDirection}
      sx={{
        ...directionStyles,
        display: 'inline-block',
        ...sx
      }}
      {...rest}
    >
      {variant ? (
        <Typography
          variant={variant}
          component="span"
          {...typographyProps}
        >
          {text}
        </Typography>
      ) : (
        text
      )}
    </Box>
  );
};

AutoDirectionText.propTypes = {
  text: PropTypes.string.isRequired,
  component: PropTypes.elementType,
  variant: PropTypes.string,
  sx: PropTypes.object,
  typographyProps: PropTypes.object
};

export default AutoDirectionText; 