import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Create direction context
const DirectionContext = createContext();

/**
 * DirectionProvider component
 * 
 * Provides RTL direction context for the entire application
 * Modified to always use RTL mode for Persian website
 */
export const DirectionProvider = ({ children }) => {
  const { i18n } = useTranslation();

  // Set html direction attribute
  useEffect(() => {
    document.dir = 'rtl';
    document.documentElement.setAttribute('lang', 'fa');
  }, []);

  // Create value object to be provided to consumers
  const value = {
    direction: 'rtl',
    isRTL: true
  };

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
};

// PropTypes for DirectionProvider
DirectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use direction context
 * 
 * @returns {Object} Direction context object
 */
export const useDirection = () => {
  const context = useContext(DirectionContext);
  
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  
  return context;
};

export default DirectionContext; 