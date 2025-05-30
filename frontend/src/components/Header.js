import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { toggleMobileMenu, toggleSearch } from '../store/slices/uiSlice';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { toPersianNumber } from '../utils/persianUtils';
import { useDirection } from '../contexts/DirectionContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { quantity: cartQuantity } = useSelector((state) => state.cart);
  const { searchOpen } = useSelector((state) => state.ui);
  const { isRTL } = useDirection();

  // Icon flip class based on direction
  const iconClass = isRTL ? "flip-horizontal" : "no-flip";

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => dispatch(toggleMobileMenu())}
                sx={{ ml: { xs: 0, sm: 1 } }}
              >
                <MenuIcon className={iconClass} />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: 1,
                fontWeight: 700,
              }}
            >
              کارنو
            </Typography>

            {!isMobile ? (
              <>
                <Box sx={{ flexGrow: 1, mx: 2, maxWidth: 500 }}>
                  <SearchBar />
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button color="inherit" component={RouterLink} to="/brands">
                    برندها
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/models">
                    مدل‌های خودرو
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/products">
                    محصولات
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/contact">
                    تماس با ما
                  </Button>
                  <IconButton color="inherit" component={RouterLink} to="/cart">
                    <Badge badgeContent={toPersianNumber(cartQuantity)} color="secondary">
                      <CartIcon className={iconClass} />
                    </Badge>
                  </IconButton>
                  <IconButton
                    color="inherit"
                    component={RouterLink}
                    to={isAuthenticated ? '/profile' : '/login'}
                  >
                    <PersonIcon className={iconClass} />
                  </IconButton>
                </Stack>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <IconButton
                  color="inherit"
                  onClick={() => dispatch(toggleSearch())}
                >
                  <SearchIcon className={iconClass} />
                </IconButton>
                <IconButton color="inherit" component={RouterLink} to="/cart">
                  <Badge badgeContent={toPersianNumber(cartQuantity)} color="secondary">
                    <CartIcon className={iconClass} />
                  </Badge>
                </IconButton>
                {isAuthenticated ? (
                  <IconButton
                    color="inherit"
                    component={RouterLink}
                    to="/profile"
                  >
                    <PersonIcon className={iconClass} />
                  </IconButton>
                ) : (
                  <Button 
                    variant="contained" 
                    color="secondary"
                    component={RouterLink} 
                    to="/login"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'secondary.dark',
                      }
                    }}
                  >
                    ورود
                  </Button>
                )}
              </Stack>
            )}
          </Toolbar>

          {isMobile && searchOpen && (
            <Box sx={{ py: 2 }}>
              <SearchBar />
            </Box>
          )}
        </Container>
      </AppBar>

      <MobileMenu />
    </>
  );
};

export default Header;
