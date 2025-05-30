import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { generateBreadcrumbSchema, generateProductSchema } from '../utils/structuredData';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  Alert,
  Snackbar,
  Button,
  Divider,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BuildIcon from '@mui/icons-material/Build';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RefreshIcon from '@mui/icons-material/Refresh';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import OilIcon from '@mui/icons-material/Opacity'; // Using a drop icon as a substitute for oil
import BrakesIcon from '@mui/icons-material/Brightness1'; // Using a circle icon as a substitute for brakes
import TireIcon from '@mui/icons-material/RadioButtonChecked'; // Using a circle icon as a substitute for tires
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import RecommendedProducts from '../components/RecommendedProducts';

// Helper function to get category icon based on category name
const getCategoryIcon = (category) => {
  switch(category) {
    case 'Engine':
    case 'موتور':
      return <SettingsIcon />;
    case 'Electrical':
    case 'برقی':
      return <ElectricalServicesIcon />;
    case 'Battery':
    case 'باتری':
      return <BatteryChargingFullIcon />;
    case 'AC':
    case 'تهویه':
    case 'Air Conditioning':
      return <AcUnitIcon />;
    case 'Oil':
    case 'روغن':
      return <OilIcon />;
    case 'Brakes':
    case 'ترمز':
      return <BrakesIcon />;
    case 'Tires':
    case 'لاستیک':
      return <TireIcon />;
    case 'Lights':
    case 'چراغ':
    case 'روشنایی':
      return <LightbulbIcon />;
    case 'Suspension':
    case 'تعلیق':
      return <DirectionsCarIcon />;
    default:
      return <BuildIcon />;
  }
};

// Helper function to get category image based on category name
const getCategoryImage = (category) => {
  switch(category) {
    case 'Engine':
    case 'موتور':
      return '/images/categories/engine.jpg';
    case 'Electrical':
    case 'برقی':
      return '/images/categories/electrical.jpg';
    case 'Battery':
    case 'باتری':
      return '/images/categories/battery.jpg';
    case 'AC':
    case 'تهویه':
    case 'Air Conditioning':
      return '/images/categories/ac.jpg';
    case 'Oil':
    case 'روغن':
      return '/images/categories/oil.jpg';
    case 'Brakes':
    case 'ترمز':
      return '/images/categories/brakes.jpg';
    case 'Tires':
    case 'لاستیک':
      return '/images/categories/tires.jpg';
    case 'Lights':
    case 'چراغ':
    case 'روشنایی':
      return '/images/categories/lights.jpg';
    case 'Suspension':
    case 'تعلیق':
      return '/images/categories/suspension.jpg';
    default:
      return '/images/categories/parts.jpg';
  }
};

// Helper function to get category title in Farsi
const getCategoryTitle = (category) => {
  switch(category) {
    case 'Engine':
      return 'قطعات موتور';
    case 'Electrical':
      return 'قطعات برقی';
    case 'Battery':
      return 'باتری و متعلقات';
    case 'AC':
    case 'Air Conditioning':
      return 'سیستم تهویه';
    case 'Oil':
      return 'روغن و فیلتر';
    case 'Brakes':
      return 'سیستم ترمز';
    case 'Tires':
      return 'لاستیک و رینگ';
    case 'Lights':
      return 'سیستم روشنایی';
    case 'Suspension':
      return 'سیستم تعلیق';
    default:
      return category;
  }
};

// Helper function to get category description in Farsi
const getCategoryDescription = (category) => {
  switch(category) {
    case 'Engine':
      return 'انواع قطعات موتور با کیفیت بالا برای تمامی خودروهای ایرانی و خارجی. شامل واشر سرسیلندر، پیستون، رینگ، شاتون، یاتاقان و سایر قطعات موتوری.';
    case 'Electrical':
      return 'قطعات و تجهیزات برقی خودرو شامل دینام، استارت، کویل، وایر، شمع، سنسورها و سایر قطعات الکتریکی با ضمانت کیفیت.';
    case 'Battery':
      return 'انواع باتری خودرو با تضمین کیفیت و طول عمر بالا، مناسب برای انواع خودروهای سبک و سنگین.';
    case 'AC':
    case 'Air Conditioning':
      return 'قطعات سیستم تهویه و کولر خودرو شامل کندانسور، اواپراتور، کمپرسور، فیلتر و سایر متعلقات با کیفیت عالی.';
    case 'Oil':
      return 'انواع روغن موتور، گیربکس و فیلترهای روغن، هوا و بنزین از برندهای معتبر داخلی و خارجی.';
    case 'Brakes':
      return 'سیستم ترمز شامل دیسک، کاسه چرخ، لنت، کالیپر و سایر قطعات ترمز با کیفیت بالا و ضمانت اصالت.';
    case 'Tires':
      return 'انواع لاستیک، رینگ و تایر برای خودروهای سواری، شاسی‌بلند و وانت با گارانتی اصالت و کیفیت.';
    case 'Lights':
      return 'سیستم روشنایی خودرو شامل چراغ‌های جلو، عقب، راهنما، مه‌شکن و سایر تجهیزات نورپردازی.';
    case 'Suspension':
      return 'قطعات سیستم تعلیق شامل کمک فنر، فنر، سیبک، طبق، لاستیک‌های تعلیق و سایر قطعات با کیفیت بالا.';
    default:
      return 'قطعات با کیفیت و اصل برای خودروهای ایرانی و خارجی با ضمانت اصالت و کیفیت.';
  }
};

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Add console log for debugging
  console.log('Products component is rendering', new Date().toISOString());
  
  // Get query parameters from URL for SEO
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const brandParam = queryParams.get('brand');
  
  // Create title and description for SEO based on query parameters
  const getSeoTitle = () => {
    if (categoryParam && brandParam) {
      return `${getCategoryTitle(categoryParam)} ${brandParam} | فروشگاه اینترنتی کارنو`;
    } else if (categoryParam) {
      return `${getCategoryTitle(categoryParam)} | فروشگاه اینترنتی کارنو`;
    } else if (brandParam) {
      return `قطعات و لوازم یدکی ${brandParam} | فروشگاه اینترنتی کارنو`;
    }
    return 'فروشگاه آنلاین قطعات یدکی و لوازم جانبی خودرو | کارنو';
  };
  
  const getSeoDescription = () => {
    if (categoryParam && brandParam) {
      return `خرید آنلاین ${getCategoryTitle(categoryParam)} ${brandParam} با قیمت مناسب، گارانتی اصالت و ارسال سریع از فروشگاه اینترنتی کارنو`;
    } else if (categoryParam) {
      return getCategoryDescription(categoryParam);
    } else if (brandParam) {
      return `فروش انواع قطعات و لوازم یدکی اصلی ${brandParam} با بهترین قیمت و کیفیت در فروشگاه اینترنتی کارنو. ضمانت اصالت کالا و ارسال سریع به سراسر ایران.`;
    }
    return 'فروشگاه اینترنتی کارنو، عرضه کننده انواع قطعات و لوازم یدکی خودروهای داخلی و خارجی با تضمین اصالت کالا. خرید آنلاین با قیمت مناسب و تحویل سریع.';
  };
  
  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'خانه', url: 'https://karno.ir/' },
    { name: 'فروشگاه', url: 'https://karno.ir/products' }
  ];
  
  // Add category to breadcrumb if present
  if (categoryParam) {
    breadcrumbItems.push({
      name: getCategoryTitle(categoryParam),
      url: `https://karno.ir/products?category=${encodeURIComponent(categoryParam)}`
    });
  }
  
  // Add brand to breadcrumb if present
  if (brandParam) {
    breadcrumbItems.push({
      name: brandParam,
      url: `https://karno.ir/products?brand=${encodeURIComponent(brandParam)}`
    });
  }
  
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [filters, setFilters] = useState({
    category: [],
    price: [0, 1000],
    rating: 0,
    availability: 'all',
    brand: null,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get unique categories from products
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set();
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [products]);

  // Get unique brands from products
  const brands = React.useMemo(() => {
    const uniqueBrands = new Set();
    products.forEach(product => {
      if (product.brand) {
        uniqueBrands.add(product.brand);
      }
    });
    return Array.from(uniqueBrands);
  }, [products]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
    
    // If brand filter is changed, update activeBrand
    if (filterName === 'brand') {
      setActiveBrand(value);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: [],
      price: [0, 1000],
      rating: 0,
      availability: 'all',
      brand: null,
    });
    setActiveCategory('all');
    setActiveBrand(null);
    setCurrentTab('all');
  };

  // Alias for handleClearFilters for the FilterSidebar component
  const handleReset = () => handleClearFilters();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Filter products based on active filters
  useEffect(() => {
    if (!products || products.length === 0) return;

    let result = [...products];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }

    // Filter by brand
    if (filters.brand) {
      result = result.filter(product => product.brand === filters.brand);
    }

    // Filter by price range
    if (filters.price && filters.price.length === 2) {
      result = result.filter(
        product => product.price >= filters.price[0] * 10000 && product.price <= filters.price[1] * 10000
      );
    }

    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter(product => product.rating >= filters.rating);
    }

    // Filter by availability
    if (filters.availability !== 'all') {
      if (filters.availability === 'inStock') {
        result = result.filter(product => product.inStock);
      } else if (filters.availability === 'onSale') {
        result = result.filter(product => product.discountPrice);
      }
    }

    setFilteredProducts(result);
  }, [products, activeCategory, filters]);

  // Test component lifecycle
  useEffect(() => {
    console.log('Products component mounted');
    return () => {
      console.log('Products component unmounted');
    };
  }, []);

  // Mock data loading
  useEffect(() => {
    setLoading(true);
    console.log('Starting to load mock products data');
    // Simulate API call
    setTimeout(() => {
      // Mock products data
      const mockProducts = [
        {
          id: 1,
          name: 'روغن موتور سینتیوم 5W-40',
          slug: 'synthetic-engine-oil-5w40',
          price: 850000,
          discountPrice: 750000,
          rating: 4.5,
          reviewCount: 128,
          image: '/images/products/engine-oil.jpg',
          category: 'Oil',
          brand: 'Shell',
          inStock: true,
          model: 'Pride',
        },
        {
          id: 2,
          name: 'روغن موتور مینرال 10W-40',
          slug: 'mineral-engine-oil-10w40',
          price: 650000,
          discountPrice: 550000,
          rating: 4.2,
          reviewCount: 56,
          image: '/images/products/engine-oil.jpg',
          category: 'Oil',
          brand: 'Total',
          inStock: true,
          model: 'Pride',
        },
        {
          id: 3,
          name: 'باتری خودرو 60Ah',
          slug: 'car-battery-60ah',
          price: 1200000,
          discountPrice: 1000000,
          rating: 4.8,
          reviewCount: 32,
          image: '/images/products/battery.jpg',
          category: 'Battery',
          brand: 'Varta',
          inStock: true,
          model: 'Pride',
        },
        {
          id: 4,
          name: 'فیلتر هوا خودرو',
          slug: 'car-air-filter',
          price: 250000,
          discountPrice: 200000,
          rating: 4.1,
          reviewCount: 24,
          image: '/images/products/air-filter.jpg',
          category: 'Oil',
          brand: 'Mann',
          inStock: true,
          model: 'Pride',
        },
        {
          id: 5,
          name: 'روغن گیربکس 80W-90',
          slug: 'gearbox-oil-80w90',
          price: 450000,
          discountPrice: 350000,
          rating: 4.3,
          reviewCount: 18,
          image: '/images/products/gearbox-oil.jpg',
          category: 'Oil',
          brand: 'Castrol',
          inStock: true,
          model: 'Pride',
        },
      ];

      setProducts(mockProducts);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <SEO
        title={getSeoTitle()}
        description={getSeoDescription()}
        canonical={`https://karno.ir/products${location.search}`}
        openGraph={{
          type: 'website',
          title: getSeoTitle(),
          description: getSeoDescription(),
          url: `https://karno.ir/products${location.search}`,
          image: categoryParam 
            ? getCategoryImage(categoryParam) 
            : 'https://karno.ir/images/products-og.jpg',
        }}
        schema={[breadcrumbSchema]}
      />
      {/* Console log to verify SEO component props */}
      {console.log('SEO schema data:', [breadcrumbSchema])}
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #f5f7fa, #ffffff)',
        minHeight: '100vh',
        py: 6,
      }}>
      <Container maxWidth="lg">
        {/* Welcome message snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
        
        {/* Page Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 2,
            backgroundImage: 'linear-gradient(to right, #1976d2, #2196f3)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', right: -50, top: -50, opacity: 0.1, fontSize: 250 }}>
            <ShoppingCartIcon fontSize="inherit" />
          </Box>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              textAlign: 'right',
              direction: 'rtl',
            }}
          >
            قطعات و لوازم یدکی خودرو
          </Typography>
          <Typography 
            variant="subtitle1" 
            paragraph 
            sx={{ 
              textAlign: 'right',
              direction: 'rtl',
              mb: 0,
            }}
          >
            مجموعه کاملی از قطعات با کیفیت برای تمامی مدل‌های خودرو
          </Typography>
        </Paper>
        
        {/* Welcome section for new users */}
        {location.state && location.state.message && (
          <Paper 
            elevation={2}
            sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: 2,
              direction: 'rtl',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              backgroundImage: 'linear-gradient(to right, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.1))',
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'bold', color: theme.palette.primary.main }}>
              به فروشگاه کارنو خوش آمدید!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              برای شروع، می‌توانید از محصولات زیر دیدن کنید یا از فیلترها برای یافتن محصولات مورد نظر خود استفاده کنید.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setNotification(prev => ({ ...prev, open: false }))}
              sx={{ alignSelf: 'flex-start' }}
            >
              شروع خرید
            </Button>
          </Paper>
        )}
        
        {/* Categories Tabs */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', direction: 'rtl' }}>
                <Typography variant="h6" sx={{ mr: 2 }}>
                  دسته‌بندی محصولات:
                </Typography>
                {isMobile && (
                  <IconButton
                    onClick={() => setFilterOpen(true)}
                    sx={{ ml: 'auto' }}
                    aria-label="نمایش فیلترها"
                    color="primary"
                  >
                    <FilterListIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ overflowX: 'auto' }}>
                <Tabs
                  value={currentTab}
                  onChange={(e, newValue) => setCurrentTab(newValue)}
                  textColor="primary"
                  indicatorColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ direction: 'rtl' }}
                >
                  <Tab 
                    value="all" 
                    label="همه قطعات" 
                    icon={<BuildIcon />} 
                    iconPosition="start" 
                  />
                  {categories.map((category) => (
                    <Tab 
                      key={category} 
                      value={category} 
                      label={category} 
                      icon={getCategoryIcon(category)} 
                      iconPosition="start" 
                    />
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Product Stats */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(25, 118, 210, 0.05)', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              direction: 'rtl',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                ارسال سریع و رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان
              </Typography>
            </Box>
            <Chip 
              label={`${filteredProducts.length} محصول`} 
              color="primary" 
              variant="outlined" 
            />
          </Paper>
        </Box>

        <Grid container spacing={4}>
          {/* Filters sidebar - desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3} className="filter-section">
              <FilterSidebar 
                categories={categories} 
                brands={brands}
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleReset={handleReset}
              />
            </Grid>
          )}
          
          {/* Products grid */}
          <Grid item xs={12} md={isMobile ? 12 : 9} className="products-grid">
            {loading ? (
              <Loading />
            ) : (
              <>
                {/* Show recommended products for new users */}
                {location.state && location.state.message && (
                  <Box sx={{ mb: 5 }}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        mb: 3,
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 'bold',
                          color: theme.palette.primary.main,
                          textAlign: 'right',
                          direction: 'rtl',
                        }}
                      >
                        محصولات پرفروش
                      </Typography>
                      <RecommendedProducts limit={4} />
                    </Paper>
                  </Box>
                )}
                
                {/* Category description and image */}
                {currentTab !== 'all' && (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      mb: 4, 
                      borderRadius: 2,
                      backgroundImage: `linear-gradient(to right, rgba(25, 118, 210, 0.7), rgba(25, 118, 210, 0.9))`,
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      direction: 'rtl',
                    }}
                  >
                    <Box sx={{ 
                      position: 'absolute', 
                      right: 0, 
                      top: 0, 
                      width: '100%', 
                      height: '100%',
                      opacity: 0.15,
                      backgroundImage: `url(${getCategoryImage(currentTab)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, position: 'relative' }}>
                      {getCategoryTitle(currentTab)}
                    </Typography>
                    <Typography variant="body1" sx={{ position: 'relative' }}>
                      {getCategoryDescription(currentTab)}
                    </Typography>
                  </Paper>
                )}
                
                <Grid container spacing={3}>
                  {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <Grid item xs={12} sm={6} md={4} key={product.id || index}>
                        <ProductCard product={product} />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Paper 
                        sx={{
                          textAlign: 'center',
                          py: 8,
                          px: 3,
                          borderRadius: 2,
                          direction: 'rtl',
                        }}
                      >
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          {activeBrand ? 
                            `محصولات برند ${activeBrand} در حال حاضر موجود نیست` : 
                            'هیچ محصولی مطابق با معیارهای شما یافت نشد'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {activeBrand ? 
                            'به زودی محصولات جدید اضافه خواهند شد' : 
                            'لطفا فیلترهای خود را تغییر دهید یا همه فیلترها را پاک کنید'}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          onClick={handleClearFilters}
                          startIcon={<RefreshIcon />}
                          sx={{ mt: 2 }}
                        >
                          پاک کردن فیلترها
                        </Button>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
};

export default Products;
