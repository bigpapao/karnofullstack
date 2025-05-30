import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Chip, // Used for country tags and common parts
} from '@mui/material';
import {
  FilterList as FilterIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';

// Mock data - replace with API calls
const brandData = {
  // Iranian Car Brands
  saipa: {
    name: 'سایپا',
    logo: 'images/brands/Saipa_Logo.png',
    description:
      'قطعات اصلی و لوازم جانبی سایپا را برای خودروی خود پیدا کنید. ما مجموعه وسیعی از قطعات اصلی و آفتر مارکت را ارائه می‌دهیم تا خودروی سایپای شما در بهترین حالت خود کار کند.',
    country: 'ایران',
    foundedYear: 1345,
    headquarters: 'تهران، ایران',
    popularModels: ['پراید', 'تیبا', 'کوییک', 'ساینا', 'شاهین'],
    commonParts: [
      'فیلتر هوا', 'فیلتر روغن', 'لنت ترمز', 'شمع', 'قطعات سیستم تعلیق',
      'تسمه تایم', 'واتر پمپ', 'دینام', 'استارتر', 'رادیاتور'
    ],
    website: 'https://www.saipacorp.com',
  },
  irankhodro: {
    name: 'ایران خودرو',
    logo: 'images/brands/iran-khodro-logo.png',
    description:
      'قطعات و لوازم جانبی اصلی ایران خودرو را خریداری کنید. ما مجموعه کاملی از قطعات اصلی و آفتر مارکت را برای خودروهای ایران خودرو ارائه می‌دهیم.',
    country: 'ایران',
    foundedYear: 1341,
    headquarters: 'تهران، ایران',
    popularModels: ['سمند', 'دنا', 'رانا', 'پژو پارس', 'پژو 207', 'تارا'],
    commonParts: [
      'قطعات موتور', 'قطعات گیربکس', 'سیستم‌های الکتریکی', 'سیستم‌های خنک‌کننده',
      'قطعات ترمز', 'قطعات سیستم تعلیق', 'پنل‌های بدنه', 'لوازم جانبی داخلی',
      'سیستم‌های روشنایی', 'قطعات سیستم سوخت'
    ],
    website: 'https://www.ikco.ir',
  },
  mvm: {
    name: 'ام وی ام',
    logo: 'images/brands/MVM_logo.png',
    description:
      'قطعات مناسب خودروهای ام وی ام (مدیران خودرو) را برای خودروی خود پیدا کنید. انتخاب ما شامل قطعات اصلی و سازگار برای تمامی مدل‌های ام وی ام است.',
    country: 'ایران',
    foundedYear: 1386,
    headquarters: 'تهران، ایران',
    popularModels: ['ام وی ام 110', 'ام وی ام 315', 'ام وی ام 550', 'ام وی ام X22', 'ام وی ام X33'],
    commonParts: [
      'قطعات سیستم تهویه', 'سیستم‌های ترمز', 'مجموعه‌های کلاچ', 'تسمه‌ها',
      'دسته موتور', 'فیلترها', 'واشرها', 'قطعات سیستم جرقه', 'سنسورها', 'قطعات فرمان'
    ],
    website: 'https://www.mvmco.ir',
  },
  bahmanmotor: {
    name: 'بهمن موتور',
    logo: 'images/brands/Bahman_motor_Logo.png',
    description:
      'قطعات با کیفیت بهمن موتور را برای تمامی مدل‌ها کشف کنید. موجودی گسترده ما شامل همه چیزهایی است که برای تعمیر و نگهداری نیاز دارید.',
    country: 'ایران',
    foundedYear: 1331,
    headquarters: 'تهران، ایران',
    popularModels: ['مزدا 3', 'کارا', 'کاپرا', 'شهاب'],
    commonParts: [
      'دینام', 'باتری', 'تسمه و شیلنگ', 'قطعات ترمز', 'قطعات کلاچ',
      'قطعات سیستم خنک‌کننده', 'قطعات موتور', 'قطعات اگزوز', 'فیلترها', 'قطعات سیستم تعلیق'
    ],
    website: 'https://www.bahman.ir',
  },
  
  // International Car Brands
  kia: {
    name: 'کیا',
    logo: '/images/brands/kia.png',
    description:
      'قطعات اصلی و لوازم جانبی کیا را برای خودروی خود پیدا کنید. ما مجموعه وسیعی از قطعات اصلی و آفتر مارکت را ارائه می‌دهیم تا خودروی کیای شما در بهترین حالت خود کار کند.',
    country: 'کره جنوبی',
    popularModels: ['اسپورتیج', 'سراتو', 'سورنتو', 'ریو'],
  },
  hyundai: {
    name: 'هیوندای',
    logo: '/images/brands/hyundai.png',
    description:
      'قطعات با کیفیت هیوندای را برای تمامی مدل‌ها کشف کنید. موجودی گسترده ما شامل همه چیزهایی است که برای تعمیر و نگهداری نیاز دارید.',
    country: 'کره جنوبی',
    popularModels: ['النترا', 'توسان', 'سانتافه', 'اکسنت'],
  },
  renault: {
    name: 'رنو',
    logo: '/images/brands/renault.png',
    description:
      'قطعات و لوازم جانبی اصلی رنو را خریداری کنید. ما مجموعه کاملی از قطعات اصلی و آفتر مارکت را برای خودروهای رنو ارائه می‌دهیم.',
    country: 'فرانسه',
    popularModels: ['داستر', 'لوگان', 'ساندرو', 'کپچر'],
  },
  geely: {
    name: 'جیلی',
    logo: '/images/brands/geely.png',
    description:
      'قطعات مناسب خودروهای جیلی را برای خودروی خود پیدا کنید. انتخاب ما شامل قطعات اصلی و سازگار برای تمامی مدل‌های جیلی است.',
    country: 'چین',
    popularModels: ['امگرند', 'کولری', 'اطلس', 'توگلا'],
  },
  toyota: {
    name: 'تویوتا',
    logo: '/images/brands/toyota.png',
    description:
      'مجموعه قطعات و لوازم جانبی تویوتا را مرور کنید. ما قطعات قابل اعتمادی ارائه می‌دهیم تا تویوتای شما بهترین عملکرد را داشته باشد.',
    country: 'ژاپن',
    popularModels: ['کمری', 'کرولا', 'راوفور', 'لندکروزر'],
  },
  honda: {
    name: 'هوندا',
    logo: '/images/brands/honda.png',
    description:
      'قطعات اصلی هوندا را برای خودروی خود تهیه کنید. موجودی ما شامل همه چیز از قطعات موتور تا قطعات بدنه است.',
    country: 'ژاپن',
    popularModels: ['سیویک', 'آکورد', 'سی‌آر‌وی', 'پایلوت'],
  },
  nissan: {
    name: 'نیسان',
    logo: '/images/brands/nissan.png',
    description:
      'قطعات و لوازم جانبی با کیفیت نیسان را خریداری کنید. همه چیزهایی که برای خودروی نیسان خود نیاز دارید را در یک مکان پیدا کنید.',
    country: 'ژاپن',
    popularModels: ['آلتیما', 'ماکسیما', 'روگ', 'پاث‌فایندر'],
  },
  bmw: {
    name: 'بی‌ام‌و',
    logo: '/images/brands/bmw.png',
    description:
      'قطعات و لوازم جانبی ممتاز بی‌ام‌و را کشف کنید. انتخاب ما شامل قطعات با کیفیت بالا برای تمامی سری‌های بی‌ام‌و است.',
    country: 'آلمان',
    popularModels: ['سری 3', 'سری 5', 'X3', 'X5'],
  },
};

const products = [
  // Saipa Products
  {
    id: 1,
    name: 'Saipa Pride Brake Pad Set',
    slug: 'saipa-pride-brake-pad-set',
    brand: 'Saipa',
    price: 45.99,
    discount: 15,
    rating: 4.2,
    reviewCount: 87,
    image: '/images/products/brake-pads.jpg',
    category: 'Brakes',
    model: 'Pride',
    compatibility: ['Pride 111', 'Pride 131', 'Pride 141'],
    inStock: true,
  },
  {
    id: 2,
    name: 'Saipa Tiba Air Filter',
    slug: 'saipa-tiba-air-filter',
    brand: 'Saipa',
    price: 18.50,
    discount: 0,
    rating: 4.0,
    reviewCount: 56,
    image: '/images/products/air-filter.jpg',
    category: 'Filters',
    model: 'Tiba',
    compatibility: ['Tiba', 'Tiba 2', 'Saina'],
    inStock: true,
  },
  {
    id: 3,
    name: 'Saipa Quick Shock Absorber Set',
    slug: 'saipa-quick-shock-absorber-set',
    brand: 'Saipa',
    price: 120.75,
    discount: 8,
    rating: 4.7,
    reviewCount: 42,
    image: '/images/products/shock-absorber.jpg',
    category: 'Suspension',
    model: 'Quick',
    compatibility: ['Quick', 'Quick MT'],
    inStock: true,
  },
  
  // Iran Khodro Products
  {
    id: 4,
    name: 'Iran Khodro Samand Timing Belt Kit',
    slug: 'iran-khodro-samand-timing-belt-kit',
    brand: 'Iran Khodro',
    price: 75.99,
    discount: 12,
    rating: 4.4,
    reviewCount: 103,
    image: '/images/products/timing-belt.jpg',
    category: 'Engine',
    model: 'Samand',
    compatibility: ['Samand LX', 'Samand EL', 'Samand Soren'],
    inStock: true,
  },
  {
    id: 5,
    name: 'Iran Khodro Dena Headlight Assembly',
    slug: 'iran-khodro-dena-headlight-assembly',
    brand: 'Iran Khodro',
    price: 135.50,
    discount: 5,
    rating: 4.8,
    reviewCount: 67,
    image: '/images/products/headlight.jpg',
    category: 'Lighting',
    model: 'Dena',
    compatibility: ['Dena', 'Dena+'],
    inStock: true,
  },
  
  // MVM Products
  {
    id: 6,
    name: 'MVM X22 Fuel Pump Assembly',
    slug: 'mvm-x22-fuel-pump-assembly',
    brand: 'MVM',
    price: 89.99,
    discount: 0,
    rating: 4.3,
    reviewCount: 38,
    image: '/images/products/fuel-pump.jpg',
    category: 'Fuel System',
    model: 'X22',
    compatibility: ['X22', 'X22 Pro'],
    inStock: true,
  },
  {
    id: 7,
    name: 'MVM 550 Clutch Kit',
    slug: 'mvm-550-clutch-kit',
    brand: 'MVM',
    price: 145.25,
    discount: 10,
    rating: 4.6,
    reviewCount: 52,
    image: '/images/products/clutch-kit.jpg',
    category: 'Transmission',
    model: '550',
    compatibility: ['550', '530'],
    inStock: true,
  },
  
  // Bahman Motor Products
  {
    id: 8,
    name: 'Bahman Mazda3 Alternator',
    slug: 'bahman-mazda3-alternator',
    brand: 'Bahman Motor',
    price: 175.99,
    discount: 15,
    rating: 4.7,
    reviewCount: 45,
    image: '/images/products/alternator.jpg',
    category: 'Electrical',
    model: 'Mazda3',
    compatibility: ['Mazda3', 'Mazda3 New'],
    inStock: true,
  },
  {
    id: 9,
    name: 'Bahman Cara Radiator',
    slug: 'bahman-cara-radiator',
    brand: 'Bahman Motor',
    price: 110.50,
    discount: 8,
    rating: 4.5,
    reviewCount: 33,
    image: '/images/products/radiator.jpg',
    category: 'Cooling System',
    model: 'Cara',
    compatibility: ['Cara', 'Cara 2000'],
    inStock: true,
  },
  
  // International Brand Products
  {
    id: 10,
    name: 'Kia Sportage Brake Pad Set',
    slug: 'kia-sportage-brake-pad-set',
    brand: 'Kia',
    price: 89.99,
    discount: 10,
    rating: 4.5,
    reviewCount: 128,
    image: '/images/products/brake-pads.jpg',
    category: 'Brakes',
    model: 'Sportage',
    inStock: true,
  },
];

const BrandDetail = () => {
  const { brandSlug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [filters, setFilters] = useState({
    category: [],
    price: [0, 1000],
    rating: 0,
    availability: 'all',
  });
  const [brandSpecificProducts, setBrandSpecificProducts] = useState([]);
  const brand = brandData[brandSlug] || {
    name: 'برند یافت نشد',
    logo: '',
    description: 'برندی که به دنبال آن هستید در حال حاضر در دسترس نیست.',
    popularModels: [],
  };

  useEffect(() => {
    const brandProducts = products.filter((product) => product.brand === brand.name);
    setBrandSpecificProducts(brandProducts);
  }, [brandSlug, products]);

  useEffect(() => {
    if (brand && products.length > 0) {
      document.title = `${brand.name} | کارنو`;
    }
  }, [brand, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: [],
      price: [0, 1000],
      rating: 0,
      availability: 'all',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3, direction: 'rtl' }}
      >
        <Link component={RouterLink} to="/" color="inherit">
          خانه
        </Link>
        <Link component={RouterLink} to="/brands" color="inherit">
          برندها
        </Link>
        <Typography color="text.primary">{brand.name}</Typography>
      </Breadcrumbs>

      {/* Brand Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            {brand.logo ? (
              <Box
                component="img"
                src={brand.logo}
                alt={brand.name}
                sx={{
                  width: '100%',
                  maxHeight: 120,
                  objectFit: 'contain',
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.light',
                  color: 'white',
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {brand.name}
                </Typography>
              </Box>
            )}
            {brand.country && (
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                <Chip 
                  label={`ساخت ${brand.country}`}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ direction: 'rtl' }}>
              قطعات و لوازم جانبی {brand.name}
            </Typography>
            <Typography color="text.secondary" paragraph sx={{ direction: 'rtl' }}>
              {brand.description}
            </Typography>
            
            {/* Brand Details */}
            {brand.foundedYear && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, direction: 'rtl' }}>
                {brand.foundedYear && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>تاسیس:</strong> {brand.foundedYear}
                  </Typography>
                )}
                {brand.headquarters && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>دفتر مرکزی:</strong> {brand.headquarters}
                  </Typography>
                )}
                {brand.website && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>وب‌سایت:</strong> <Link href={brand.website} target="_blank" rel="noopener">{brand.website}</Link>
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Popular Models */}
            {brand.popularModels && brand.popularModels.length > 0 && (
              <Box sx={{ mt: 2, direction: 'rtl' }}>
                <Typography variant="subtitle1" gutterBottom>
                  مدل‌های محبوب:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {brand.popularModels.map((model) => {
                    // Find the model ID from our carModels data (this would come from API in real app)
                    // Here we're just using a simple mapping for demonstration
                    const modelId = {
                      'پراید': 1,
                      'تیبا': 3,
                      'کوییک': 4,
                      'ساینا': 5,
                      'شاهین': 5,
                      'سمند': 8,
                      'دنا': 9,
                      'رانا': 10,
                      'پژو پارس': 7,
                      'پژو 207': 6,
                      'تارا': 10,
                      'ام وی ام 110': 13,
                      'ام وی ام 315': 13,
                      'ام وی ام 550': 12,
                      'ام وی ام X22': 11,
                      'ام وی ام X33': 12,
                      'مزدا 3': 14,
                      'کارا': 15,
                      'کاپرا': 16,
                      'شهاب': 16,
                    }[model] || 1; // Default to 1 if not found
                    
                    return (
                      <Button
                        key={model}
                        variant="outlined"
                        size="small"
                        component={RouterLink}
                        to={`/models/${modelId}`}
                      >
                        {model}
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            )}
            
            {/* Common Parts */}
            {brand.commonParts && brand.commonParts.length > 0 && (
              <Box sx={{ mt: 3, direction: 'rtl' }}>
                <Typography variant="subtitle1" gutterBottom>
                  قطعات و لوازم جانبی متداول:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {brand.commonParts.map((part) => (
                    <Chip
                      key={part}
                      label={part}
                      variant="outlined"
                      size="small"
                      clickable
                      component={RouterLink}
                      to={`/products?brand=${brandSlug}&category=${part.toLowerCase().replace(' ', '-')}`}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar />
      </Box>

      {/* Tabs and Filter Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          direction: 'rtl',
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(e, value) => setCurrentTab(value)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="all" label="همه قطعات" />
          <Tab value="popular" label="محبوب‌ترین‌ها" />
          <Tab value="new" label="تازه رسیده‌ها" />
          <Tab value="sale" label="حراج" />
        </Tabs>
        {isMobile && (
          <IconButton
            onClick={() => setFilterOpen(true)}
            sx={{ ml: 2 }}
          >
            <FilterIcon />
          </IconButton>
        )}
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filter Sidebar */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
              type="brand"
              title="فیلترها"
              buttonText="پاک کردن فیلترها"
            />
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={!isMobile ? 9 : 12}>
          <Grid container spacing={3}>
            {brandSpecificProducts.length > 0 ? (
              brandSpecificProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{
                    py: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    محصولی یافت نشد
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    متأسفانه، هیچ محصولی برای {brand.name} در حال حاضر در دسترس نیست.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/products"
                    sx={{ mt: 2 }}
                  >
                    مشاهده همه محصولات
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Mobile Filter Dialog */}
      {isMobile && (
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          type="brand"
          mobile={true}
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          title="فیلترها"
          buttonText="پاک کردن فیلترها"
        />
      )}
    </Container>
  );
};

export default BrandDetail;
