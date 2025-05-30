import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Category as CategoriesIcon,
  LocalOffer as BrandsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { useDirection } from '../contexts/DirectionContext';
import { useDirectionalValue } from '../utils/directionComponentUtils';

const drawerWidth = 240;

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Get directional values based on current direction
  const drawerAnchor = useDirectionalValue('right', 'left');
  const marginProp = useDirectionalValue('mr', 'ml');
  const marginStartProp = useDirectionalValue('ml', 'mr');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const menuItems = [
    { text: 'داشبورد', icon: <DashboardIcon />, path: '/admin' },
    { text: 'محصولات', icon: <ProductsIcon />, path: '/admin/products' },
    { text: 'سفارشات', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'کاربران', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'دسته‌بندی‌ها', icon: <CategoriesIcon />, path: '/admin/categories' },
    { text: 'برندها', icon: <BrandsIcon />, path: '/admin/brands' },
    { text: 'تنظیمات', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, text: 'سفارش جدید دریافت شد', read: false },
    { id: 2, text: 'محصول X به اتمام رسیده است', read: false },
    { id: 3, text: 'کاربر جدید ثبت نام کرد', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const drawer = (
    <div>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          پنل مدیریت کارنو
        </Typography>
        <Avatar 
          alt={user?.name || 'Admin'} 
          src={user?.avatar} 
          sx={{ width: 64, height: 64, mb: 1 }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {user?.name || 'مدیر سیستم'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || 'admin@karno.ir'}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ direction: 'rtl' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                selected={isActive}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ mt: 2 }} />
      <List sx={{ direction: 'rtl' }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="خروج" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : 'پنل مدیریت';
  };

  return (
    <Box sx={{ display: 'flex', direction: isRTL ? 'rtl' : 'ltr' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          [marginProp]: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge={isRTL ? "end" : "start"}
            onClick={handleDrawerToggle}
            sx={{ [marginStartProp]: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getCurrentPageTitle()}
          </Typography>
          
          <Tooltip title="اعلان‌ها">
            <IconButton 
              color="inherit" 
              onClick={handleNotificationOpen}
              sx={{ mx: 1 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ [marginStartProp]: 1 }}
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Avatar 
              alt={user?.name || 'Admin'} 
              src={user?.avatar}
              sx={{ width: 40, height: 40 }}
            />
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: isRTL ? 'left' : 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: isRTL ? 'left' : 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">پروفایل</Typography>
            </MenuItem>
            <MenuItem component={RouterLink} to="/admin/settings" onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">تنظیمات</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">خروج</Typography>
            </MenuItem>
          </Menu>
          
          <Menu
            id="notifications-menu"
            anchorEl={notificationAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: isRTL ? 'left' : 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: isRTL ? 'left' : 'right',
            }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              style: {
                maxHeight: 300,
                width: '300px',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
              اعلان‌ها
            </Typography>
            <Divider />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  onClick={handleNotificationClose}
                  sx={{ 
                    whiteSpace: 'normal',
                    direction: 'rtl',
                    bgcolor: notification.read ? 'transparent' : 'action.hover'
                  }}
                >
                  <Typography variant="body2">{notification.text}</Typography>
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleNotificationClose}>
                <Typography variant="body2">اعلان جدیدی وجود ندارد</Typography>
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary">
                مشاهده همه اعلان‌ها
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          anchor={drawerAnchor}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
