import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  Home,
  DirectionsCar,
  Build,
  ShoppingCart,
  Person,
  Article,
  Info,
  ContactSupport,
  Close as CloseIcon,
} from '@mui/icons-material';
import { toggleMobileMenu } from '../store/slices/uiSlice';

const MobileMenu = () => {
  const dispatch = useDispatch();
  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(toggleMobileMenu());
  };

  const menuItems = [
    { text: 'صفحه اصلی', icon: <Home className="no-flip" />, path: '/' },
    { text: 'برندها', icon: <DirectionsCar className="no-flip" />, path: '/brands' },
    { text: 'محصولات', icon: <Build className="no-flip" />, path: '/products' },
    { text: 'سبد خرید', icon: <ShoppingCart className="no-flip" />, path: '/cart' },
    { text: 'وبلاگ', icon: <Article className="no-flip" />, path: '/blog' },
    { text: 'درباره ما', icon: <Info className="no-flip" />, path: '/about' },
    { text: 'تماس با ما', icon: <ContactSupport className="no-flip" />, path: '/contact' },
  ];

  const accountItems = isAuthenticated
    ? [
        { text: 'پروفایل', icon: <Person className="no-flip" />, path: '/profile' },
        { text: 'سفارشات', icon: <ShoppingCart className="no-flip" />, path: '/orders' },
      ]
    : [
        { text: 'ورود', icon: <Person className="no-flip" />, path: '/login' },
        { text: 'ثبت نام', icon: <Person className="no-flip" />, path: '/register' },
      ];

  return (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 280 },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          کارنو
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon className="no-flip" />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {accountItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MobileMenu;
