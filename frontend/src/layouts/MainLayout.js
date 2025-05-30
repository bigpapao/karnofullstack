import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartAuthNotification from '../components/CartAuthNotification';

const MainLayout = () => {
  const location = useLocation();

  // Fixed RTL animations (right-to-left)
  const initialAnimation = {
    opacity: 0,
    x: -20,
    y: 20,
  };
  
  const exitAnimation = {
    opacity: 0,
    x: 20,
    y: -20,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={initialAnimation}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={exitAnimation}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Container>
      <Footer />
      <CartAuthNotification />
    </Box>
  );
};

export default MainLayout;
