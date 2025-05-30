/**
 * AlertMessage Component
 * 
 * A customizable alert message component for displaying success, error,
 * warning, and info messages with auto-dismissal option.
 */

import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  AlertTitle, 
  Collapse, 
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * AlertMessage Component
 * 
 * @param {Object} props
 * @param {string} props.severity - Alert severity: 'success', 'error', 'warning', 'info'
 * @param {string} props.title - Optional title for the alert
 * @param {string|React.ReactNode} props.message - Alert message content
 * @param {boolean} props.open - Whether the alert is visible
 * @param {function} props.onClose - Optional callback when alert is closed
 * @param {boolean} props.autoHide - Whether to automatically hide the alert after a timeout
 * @param {number} props.autoHideTimeout - Timeout in ms before auto-hiding (default: 6000)
 * @param {Object} props.sx - Additional MUI styles
 */
const AlertMessage = ({
  severity = 'info',
  title,
  message,
  open = true,
  onClose,
  autoHide = false,
  autoHideTimeout = 6000,
  sx = {}
}) => {
  const [isVisible, setIsVisible] = useState(open);
  
  // Handle prop changes
  useEffect(() => {
    setIsVisible(open);
  }, [open]);
  
  // Handle auto-hide
  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoHideTimeout);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, isVisible, autoHideTimeout, onClose]);
  
  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  // Don't render if no message
  if (!message) return null;
  
  return (
    <Box sx={{ width: '100%', mb: 2, ...sx }}>
      <Collapse in={isVisible}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default AlertMessage; 