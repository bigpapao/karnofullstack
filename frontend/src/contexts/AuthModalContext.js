import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthModal from '../components/AuthModal';

const AuthModalContext = createContext();

export const useAuthModal = () => useContext(AuthModalContext);

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');

  const openAuthModal = (redirectTo = '/') => {
    setRedirectPath(redirectTo);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    // Ensure the modal closes properly
    setIsOpen(false);
  };

  // Add a useEffect to handle any cleanup when the modal closes
  useEffect(() => {
    if (!isOpen) {
      // Any cleanup needed when modal closes
      // This helps ensure proper state reset
    }
  }, [isOpen]);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal 
        open={isOpen} 
        onClose={closeAuthModal} 
        redirectAfterLogin={redirectPath}
      />
    </AuthModalContext.Provider>
  );
};

export default AuthModalContext;
