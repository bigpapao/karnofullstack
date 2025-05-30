import React from 'react';
import { Grid, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useDirection } from '../contexts/DirectionContext';

/**
 * RTLAwareGrid Component
 * 
 * A wrapper around Material UI's Grid component that automatically
 * handles RTL layout concerns, such as reordering items, adjusting
 * spacing, and handling alignment.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.reverseInRTL - Whether to reverse children order in RTL mode
 * @param {boolean} props.isContainer - Whether this is a container grid
 * @param {object} props.containerProps - Props to pass to the container Grid
 * @param {React.ReactNode} props.children - Child elements
 * @param {object} props.sx - SX prop overrides
 * @returns {React.ReactElement} - RTL-aware Grid component
 */
const RTLAwareGrid = ({
  reverseInRTL = true,
  isContainer = true,
  containerProps = {},
  children,
  sx = {},
  ...rest
}) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  // If we're in RTL mode and should reverse, apply special handling
  if (isRTL && reverseInRTL && isContainer) {
    return (
      <Grid
        container
        {...containerProps}
        sx={{
          '& > .MuiGrid-item': {
            direction: 'rtl',
            textAlign: 'right',
          },
          ...sx,
        }}
        {...rest}
      >
        {React.Children.toArray(children).reverse()}
      </Grid>
    );
  }
  
  // For item grids or when no special RTL handling is needed
  if (isContainer) {
    return (
      <Grid
        container
        {...containerProps}
        sx={{
          ...(isRTL && {
            '& > .MuiGrid-item': {
              direction: 'rtl',
              textAlign: 'right',
            },
          }),
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Grid>
    );
  }
  
  // For Grid items
  return (
    <Grid
      item
      sx={{
        ...(isRTL && {
          direction: 'rtl',
          textAlign: 'right',
        }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Grid>
  );
};

/**
 * RTLAwareGridItem Component
 * 
 * A wrapper for Grid items with RTL-specific handling
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {object} props.sx - SX prop overrides
 * @returns {React.ReactElement} - RTL-aware Grid item
 */
export const RTLAwareGridItem = ({ children, sx = {}, ...rest }) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  return (
    <Grid
      item
      sx={{
        ...(isRTL && {
          direction: 'rtl',
          textAlign: 'right',
        }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Grid>
  );
};

/**
 * RTLAwareBox Component
 * 
 * A wrapper around Material UI's Box component with RTL layout awareness
 * 
 * @param {object} props - Component props
 * @param {boolean} props.reverseInRTL - Whether to reverse flex direction in RTL mode
 * @param {React.ReactNode} props.children - Child elements
 * @param {object} props.sx - SX prop overrides
 * @returns {React.ReactElement} - RTL-aware Box component
 */
export const RTLAwareBox = ({
  reverseInRTL = true,
  children,
  sx = {},
  ...rest
}) => {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  // Handle flex direction for RTL if needed
  let updatedSx = { ...sx };
  
  if (isRTL && reverseInRTL) {
    if (sx.display === 'flex' && sx.flexDirection === 'row') {
      updatedSx.flexDirection = 'row-reverse';
    }
    
    if (sx.justifyContent === 'flex-start') {
      updatedSx.justifyContent = 'flex-end';
    } else if (sx.justifyContent === 'flex-end') {
      updatedSx.justifyContent = 'flex-start';
    }
  }
  
  return (
    <Box
      sx={updatedSx}
      {...rest}
    >
      {children}
    </Box>
  );
};

RTLAwareGrid.propTypes = {
  reverseInRTL: PropTypes.bool,
  isContainer: PropTypes.bool,
  containerProps: PropTypes.object,
  children: PropTypes.node,
  sx: PropTypes.object,
};

RTLAwareGridItem.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

RTLAwareBox.propTypes = {
  reverseInRTL: PropTypes.bool,
  children: PropTypes.node,
  sx: PropTypes.object,
};

export default RTLAwareGrid; 