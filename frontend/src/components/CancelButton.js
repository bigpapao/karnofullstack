import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * A reusable Cancel Button component with consistent styling across the application
 * This component standardizes the appearance and behavior of cancel actions
 */
const CancelButton = ({
  onClick,
  text = 'انصراف',
  variant = 'outlined',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  startIcon = null,
  endIcon = null,
  className = '',
  testId = 'cancel-button',
  ...props
}) => {
  const theme = useTheme();
  
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      className={className}
      data-testid={testId}
      sx={{
        direction: 'rtl',
        fontWeight: 500,
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        ...props.sx
      }}
      {...props}
    >
      {text}
    </Button>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  variant: PropTypes.oneOf(['text', 'contained', 'outlined']),
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  className: PropTypes.string,
  testId: PropTypes.string,
  sx: PropTypes.object,
};

export default CancelButton; 