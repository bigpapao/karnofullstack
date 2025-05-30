import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { fetchProducts } from '../store/slices/productSlice';
import { useDirection } from '../contexts/DirectionContext';
import { useDirectionalValue } from '../utils/directionComponentUtils';

const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_low', label: 'قیمت: کم به زیاد' },
  { value: 'price_high', label: 'قیمت: زیاد به کم' },
  { value: 'popular', label: 'محبوب‌ترین' },
];

const ProductList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  
  // Get directional values for positioning
  const drawerAnchor = useDirectionalValue('right', 'left');
  const filterGridOrder = useDirectionalValue(1, 0);
  const productGridOrder = useDirectionalValue(0, 1);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { products, loading, error, totalPages } = useSelector(
    (state) => state.products
  );

  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');

  useEffect(() => {
    dispatch(fetchProducts({ page, sortBy, category, brand }));
  }, [dispatch, page, sortBy, category, brand]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" py={8}>
          خطا در بارگیری محصولات. لطفا دوباره امتحان کنید.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          خانه
        </Link>
        <Link color="inherit" href="/products">
          محصولات
        </Link>
        {category && (
          <Typography color="text.primary">
            {category.replace(/-/g, ' ')}
          </Typography>
        )}
      </Breadcrumbs>

      {/* Title and Sort */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          {category
            ? category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
            : 'همه محصولات'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton onClick={toggleMobileFilter} color="primary">
              <FilterListIcon />
            </IconButton>
          )}
          <FormControl size="small">
            <Select value={sortBy} onChange={handleSortChange}>
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filter Sidebar - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3} sx={{ order: { md: filterGridOrder } }}>
            <FilterSidebar />
          </Grid>
        )}

        {/* Product Grid */}
        <Grid item xs={12} md={9} sx={{ order: { md: productGridOrder } }}>
          <Grid container spacing={3}>
            {loading ? (
              // Loading skeleton
              [...Array(8)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ProductCard loading />
                </Grid>
              ))
            ) : products.length === 0 ? (
              <Grid item xs={12}>
                <Typography align="center" color="text.secondary" py={8}>
                  محصولی یافت نشد. لطفا فیلترها را تغییر دهید.
                </Typography>
              </Grid>
            ) : (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            )}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor={drawerAnchor}
        open={mobileFilterOpen}
        onClose={toggleMobileFilter}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 360,
            p: 2,
          },
        }}
      >
        <FilterSidebar onClose={toggleMobileFilter} />
      </Drawer>
    </Container>
  );
};

export default ProductList;
