import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip,
  Button,
  CardContent,
  Fade,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardActionArea,
  CardMedia,
} from '@mui/material';
import { 
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  Star as StarIcon,
  Public as GlobalIcon,
  LocalShipping as ShippingIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortIcon,
} from '@mui/icons-material';
import BrandCard from '../components/BrandCard';
import { toPersianNumber } from '../utils/persianUtils';

// Mock brands data
const brandsData = [
  // Iranian Car Brands
  {
    id: 1,
    name: 'سایپا',
    slug: 'saipa',
    logo: '/images/brands/saipa.png',
    partsCount: 1850,
    featured: true,
    country: 'ایران',
    description: 'سایپا یکی از بزرگترین خودروسازان ایران است که طیف گسترده‌ای از خودروهای سواری و تجاری را تولید می‌کند.',
    popularModels: ['پراید', 'تیبا', 'کوییک', 'شاهین'],
    establishedYear: 1966,
    headquarters: 'تهران، ایران',
  },
  {
    id: 2,
    name: 'ایران خودرو',
    slug: 'irankhodro',
    logo: '/images/brands/irankhodro.png',
    partsCount: 2100,
    featured: true,
    country: 'ایران',
    description: 'ایران خودرو (IKCO) بزرگترین تولیدکننده خودرو در ایران و خاورمیانه است که مدل‌های مختلفی از جمله سمند و دنا را تولید می‌کند.',
    popularModels: ['پژو 206', 'پژو پارس', 'سمند', 'دنا', 'رانا'],
    establishedYear: 1962,
    headquarters: 'تهران، ایران',
  },
  {
    id: 3,
    name: 'ام وی ام',
    slug: 'mvm',
    logo: '/images/brands/mvm.png',
    partsCount: 1250,
    featured: true,
    country: 'ایران',
    description: 'ام وی ام (مدیران خودرو) مدل‌های چری چینی را در ایران با اصلاحات و بهبودهای محلی تولید می‌کند.',
    popularModels: ['ام وی ام X22', 'ام وی ام X33', 'ام وی ام 315'],
    establishedYear: 2006,
    headquarters: 'تهران، ایران',
  },
  {
    id: 4,
    name: 'بهمن موتور',
    slug: 'bahmanmotor',
    logo: '/images/brands/bahmanmotor.png',
    partsCount: 980,
    featured: true,
    country: 'ایران',
    description: 'گروه بهمن یک خودروساز ایرانی است که انواع خودروهای سواری و تجاری از جمله مدل‌های مزدا را تحت لیسانس تولید می‌کند.',
    popularModels: ['مزدا 3', 'دیگنیتی', 'فیدلیتی'],
    establishedYear: 1952,
    headquarters: 'تهران، ایران',
  },
  // International Car Brands
  {
    id: 5,
    name: 'کیا',
    slug: 'kia',
    logo: '/images/brands/kia.png',
    partsCount: 1245,
    featured: false,
    country: 'کره جنوبی',
    description: 'کیا موتورز یک تولیدکننده خودرو کره جنوبی با حضور جهانی است.',
    popularModels: ['سراتو', 'اسپورتیج', 'اپتیما'],
    establishedYear: 1944,
    headquarters: 'سئول، کره جنوبی',
  },
  {
    id: 6,
    name: 'هیوندای',
    slug: 'hyundai',
    logo: '/images/brands/hyundai.png',
    partsCount: 1532,
    featured: false,
    country: 'کره جنوبی',
    description: 'شرکت هیوندای موتور یک تولیدکننده چندملیتی خودرو کره جنوبی است.',
    popularModels: ['النترا', 'سوناتا', 'توسان'],
    establishedYear: 1967,
    headquarters: 'سئول، کره جنوبی',
  },
  {
    id: 7,
    name: 'رنو',
    slug: 'renault',
    logo: '/images/brands/renault.png',
    partsCount: 987,
    featured: false,
    country: 'فرانسه',
    description: 'رنو یک تولیدکننده چندملیتی خودرو فرانسوی است که در سال 1899 تأسیس شده است.',
    popularModels: ['تندر 90', 'ساندرو', 'کولیوس'],
    establishedYear: 1899,
    headquarters: 'پاریس، فرانسه',
  },
  {
    id: 8,
    name: 'جیلی',
    slug: 'geely',
    logo: '/images/brands/geely.png',
    partsCount: 654,
    featured: false,
    country: 'چین',
    description: 'جیلی اتو یک شرکت خودروسازی چینی است که خودروهای سواری را طراحی، توسعه، تولید و می‌فروشد.',
    popularModels: ['امگرند', 'GC6', 'EC7'],
    establishedYear: 1986,
    headquarters: 'هانگژو، چین',
  },
  {
    id: 9,
    name: 'تویوتا',
    slug: 'toyota',
    logo: '/images/brands/toyota.png',
    partsCount: 1850,
    featured: true,
    country: 'ژاپن',
    description: 'تویوتا موتور کورپوریشن یک شرکت خودروسازی چندملیتی ژاپنی است که به عنوان بزرگترین تولیدکننده خودرو در جهان شناخته می‌شود.',
    popularModels: ['کمری', 'کرولا', 'لندکروزر', 'پرادو'],
    establishedYear: 1937,
    headquarters: 'تویوتا، ژاپن',
  },
  {
    id: 10,
    name: 'نیسان',
    slug: 'nissan',
    logo: '/images/brands/nissan.png',
    partsCount: 1540,
    featured: false,
    country: 'ژاپن',
    description: 'نیسان موتور یک شرکت خودروسازی چندملیتی ژاپنی است که انواع خودروهای سواری، کراس‌اوور و SUV را تولید می‌کند.',
    popularModels: ['ماکسیما', 'ایکس-تریل', 'قشقایی'],
    establishedYear: 1933,
    headquarters: 'یوکوهاما، ژاپن',
  },
];

// Define available countries for filtering
const countries = [...new Set(brandsData.map(brand => brand.country))];

const Brands = () => {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('iranian');
  const [sortOrder, setSortOrder] = useState('alphabetical');
  const [selectedCountry, setSelectedCountry] = useState('all');
  
  // Simulated API fetch
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBrands(brandsData);
      setLoading(false);
    };
    
    fetchBrands();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };
  
  // Filter brands based on search term, tab selection, and country filter
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesTab =
      currentTab === 'all' ||
      (currentTab === 'featured' && brand.featured) ||
      (currentTab === 'iranian' && brand.country === 'ایران') ||
      (currentTab === 'international' && brand.country !== 'ایران');
      
    const matchesCountry = 
      selectedCountry === 'all' || 
      brand.country === selectedCountry;
      
    return matchesSearch && matchesTab && matchesCountry;
  });
  
  // Sort brands based on sort order
  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortOrder) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'partsCount':
        return b.partsCount - a.partsCount;
      case 'establishedYear':
        return a.establishedYear - b.establishedYear;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Generate brand skeleton loaders while data is loading
  const BrandSkeletons = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton variant="rectangular" width={120} height={120} sx={{ borderRadius: '50%', mb: 2 }} />
                <Skeleton variant="text" width="70%" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <>
      <SEO
        title="برندهای خودرو | فروشگاه اینترنتی کارنو"
        description="مشاهده و مقایسه انواع برندهای خودرو ایرانی و خارجی در فروشگاه اینترنتی کارنو. خرید انواع قطعات و لوازم یدکی برندهای معتبر خودرو با گارانتی اصالت و بهترین قیمت."
        canonical="https://karno.ir/brands"
        openGraph={{
          type: 'website',
          title: 'برندهای خودرو | فروشگاه اینترنتی کارنو',
          description: 'مشاهده و مقایسه انواع برندهای خودرو ایرانی و خارجی در فروشگاه اینترنتی کارنو',
          url: 'https://karno.ir/brands',
          image: 'https://karno.ir/images/brands-og.jpg',
        }}
      />
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #f5f7fa, #ffffff)',
        minHeight: '100vh',
        py: 6,
      }}>
        <Container maxWidth="lg">
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
              <CarIcon fontSize="inherit" />
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
              برندهای خودرو
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
              مجموعه گسترده‌ای از قطعات خودرو برای برندهای ایرانی و بین‌المللی
            </Typography>
          </Paper>

          {/* Search and Filters */}
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="جستجوی برندها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: { direction: 'rtl' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  textColor="primary"
                  indicatorColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ direction: 'rtl' }}
                >
                  <Tab value="iranian" label="برندهای ایرانی" icon={<CarIcon />} iconPosition="start" />
                  <Tab value="international" label="برندهای خارجی" icon={<GlobalIcon />} iconPosition="start" />
                  <Tab value="featured" label="برندهای ویژه" icon={<StarIcon />} iconPosition="start" />
                  <Tab value="all" label="همه برندها" />
                </Tabs>
              </Grid>
            </Grid>
          </Paper>

          {/* Advanced Filters */}
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2, direction: 'rtl' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ ml: 1 }} />
              فیلتر و مرتب‌سازی
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="country-filter-label">کشور سازنده</InputLabel>
                  <Select
                    labelId="country-filter-label"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    label="کشور سازنده"
                  >
                    <MenuItem value="all">همه کشورها</MenuItem>
                    {countries.map(country => (
                      <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="sort-order-label">مرتب‌سازی</InputLabel>
                  <Select
                    labelId="sort-order-label"
                    value={sortOrder}
                    onChange={handleSortChange}
                    label="مرتب‌سازی"
                    startAdornment={<SortIcon sx={{ ml: 1 }} />}
                  >
                    <MenuItem value="alphabetical">حروف الفبا (الف تا ی)</MenuItem>
                    <MenuItem value="partsCount">تعداد قطعات (نزولی)</MenuItem>
                    <MenuItem value="establishedYear">سال تاسیس (صعودی)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Bar */}
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
                <ShippingIcon color="primary" sx={{ ml: 1 }} />
                <Typography variant="body1">
                  ارسال سریع قطعات اصلی به سراسر کشور
                </Typography>
              </Box>
              <Chip 
                label={loading ? 'در حال بارگذاری...' : `${toPersianNumber(sortedBrands.length)} برند`} 
                color="primary" 
                variant="outlined" 
              />
            </Paper>
          </Box>

          {/* Brands Grid */}
          <Grid container spacing={3} className="brands-grid">
            {loading ? (
              <BrandSkeletons />
            ) : (
              <>
                {sortedBrands.map((brand) => (
                  <Grid item key={brand.id} xs={12} sm={6} md={4}>
                    <Fade in={true} timeout={500}>
                      <Box>
                        <BrandCard brand={brand} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </>
            )}
          </Grid>

          {!loading && sortedBrands.length === 0 && (
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
                هیچ برندی مطابق با معیارهای جستجوی شما یافت نشد
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                لطفا معیارهای جستجو یا فیلترهای خود را تغییر دهید
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentTab('all');
                  setSelectedCountry('all');
                  setSortOrder('alphabetical');
                }}
              >
                پاک کردن فیلترها
              </Button>
            </Paper>
          )}
          
          {/* Additional Info Section */}
          {!loading && sortedBrands.length > 0 && (
            <Paper sx={{ mt: 5, p: 4, borderRadius: 2, direction: 'rtl' }}>
              <Typography variant="h5" gutterBottom>
                راهنمای خرید قطعات براساس برند خودرو
              </Typography>
              <Typography variant="body1" paragraph>
                کارنو به شما این امکان را می‌دهد تا بر اساس برند و مدل خودروی خود، قطعات مورد نیاز را پیدا کنید. کافیست برند خودروی خود را انتخاب کنید و سپس از میان قطعات مخصوص آن برند، محصول مورد نظر خود را پیدا کنید.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                ضمانت اصالت کالا
              </Typography>
              <Typography variant="body1">
                تمامی قطعات ارائه شده در کارنو دارای ضمانت اصالت هستند و از نمایندگی‌های رسمی و منابع معتبر تهیه می‌شوند. در صورت هرگونه مغایرت، امکان بازگشت محصول تا ۷ روز فراهم است.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Brands;
