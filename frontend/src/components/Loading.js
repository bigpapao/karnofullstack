import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

/**
 * Loading component that displays a spinner with an optional message.
 * Used as a fallback during page transitions and data loading.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.message='در حال بارگذاری...'] - Loading message to display
 * @param {number} [props.size=40] - Size of the circular progress indicator
 * @param {boolean} [props.fullPage=false] - Whether to take up the full page height
 * @param {number} [props.delay=300] - Delay in ms before showing the loading indicator
 */
const Loading = ({ 
  message = 'در حال بارگذاری...', 
  size = 40, 
  fullPage = false,
  delay = 300
}) => {
  const [showLoader, setShowLoader] = React.useState(delay === 0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: fullPage ? 'calc(100vh - 100px)' : '200px',
    textAlign: 'center',
    py: 4
  };
  
  if (!showLoader) {
    return null;
  }
  
  return (
    <Fade in={showLoader} timeout={400}>
      <Box sx={containerStyles}>
        <CircularProgress 
          size={size} 
          color="primary" 
          aria-label="بارگذاری"
        />
        
        {message && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number,
  fullPage: PropTypes.bool,
  delay: PropTypes.number
};

export default Loading; 