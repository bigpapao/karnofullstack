import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useDirection } from '../contexts/DirectionContext';

/**
 * Icon Flip Component
 * 
 * Handles proper flipping of icons in RTL mode.
 * Useful for direction-sensitive icons like arrows.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The icon element to potentially flip
 * @param {boolean} props.flip - Whether to flip the icon in RTL mode (default: true)
 * @param {boolean} props.alwaysFlip - Whether to always flip the icon regardless of mode (default: false)
 * @param {boolean} props.neverFlip - Whether to never flip the icon (overrides other props) (default: false)
 * @param {Object} props.sx - Additional sx styles to apply to the Box wrapper
 */
const IconFlip = ({
  children,
  flip = true,
  alwaysFlip = false,
  neverFlip = false,
  sx = {},
  ...rest
}) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  // Determine if we should flip the icon
  const shouldFlip = neverFlip ? false : (alwaysFlip || (isRTL && flip));
  
  const flipStyles = shouldFlip ? { transform: 'scaleX(-1)' } : {};
  
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...flipStyles,
        ...sx
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

IconFlip.propTypes = {
  children: PropTypes.node.isRequired,
  flip: PropTypes.bool,
  alwaysFlip: PropTypes.bool,
  neverFlip: PropTypes.bool,
  sx: PropTypes.object,
};

export default IconFlip; 