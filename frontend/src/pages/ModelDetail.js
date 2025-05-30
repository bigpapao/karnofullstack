import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button,
  Chip,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  Build as BuildIcon,
  LocalOffer as PriceIcon,
  FilterAlt as FilterIcon,
  LocalGasStation as FuelIcon,
  CalendarToday as YearIcon,
  Settings as PartsIcon,
  Info as InfoIcon,
  Check as CompatibleIcon,
} from '@mui/icons-material';
import ProductCard from '../components/ProductCard';

// Sample car models data (this would come from your API)
const carModels = [
  // سایپا
  {
    id: 1,
    name: 'پراید 111',
    brand: 'سایپا',
    brandId: 1,
    brandSlug: 'saipa',
    image: '/images/models/pride111.jpg',
    year: '1398-1401',
    engine: '1.3 لیتر',
    partsCount: 450,
    popular: true,
    description: 'پراید 111 یکی از پرفروش‌ترین خودروهای ایران با قطعات فراوان در بازار است.',
    category: 'هاچبک',
    specifications: {
      engineSize: '1.3 لیتر',
      power: '63 اسب بخار',
      transmission: 'دستی 5 سرعته',
      fuelType: 'بنزین',
      bodyType: 'هاچبک',
      seatingCapacity: '4 نفر',
      length: '3800 میلی‌متر',
      width: '1600 میلی‌متر',
      height: '1460 میلی‌متر',
      wheelbase: '2380 میلی‌متر',
    },
    commonIssues: [
      'مشکلات سیستم خنک‌کننده',
      'خرابی دینام',
      'فرسودگی سیستم تعلیق',
      'مشکلات برقی',
      'نشتی روغن',
    ],
  },
  {
    id: 8,
    name: 'سمند',
    brand: 'ایران خودرو',
    brandId: 2,
    brandSlug: 'irankhodro',
    image: '/images/models/samand.jpg',
    year: '1388-1402',
    engine: '1.7 لیتر',
    partsCount: 470,
    popular: true,
    description: 'سمند اولین خودروی ملی ایران که توسط ایران خودرو طراحی و تولید شده است.',
    category: 'سدان',
    specifications: {
      engineSize: '1.7 لیتر',
      power: '100 اسب بخار',
      transmission: 'دستی 5 سرعته',
      fuelType: 'بنزین',
      bodyType: 'سدان',
      seatingCapacity: '5 نفر',
      length: '4500 میلی‌متر',
      width: '1700 میلی‌متر',
      height: '1460 میلی‌متر',
      wheelbase: '2670 میلی‌متر',
    },
    commonIssues: [
      'مشکلات جعبه دنده',
      'ایرادات سیستم برقی',
      'نشتی روغن موتور',
      'مشکلات سیستم تعلیق',
      'ایرادات سیستم سوخت‌رسانی',
    ],
  },
];

// Sample parts data (this would come from your API)
const partsSampleData = [
  // پراید 111
  {
    id: 1,
    name: 'فیلتر روغن پراید',
    slug: 'pride-oil-filter',
    brand: 'سایپا',
    modelId: 1,
    price: 180000,
    discount: 10,
    rating: 4.5,
    reviewCount: 128,
    image: '/images/products/oil-filter.jpg',
    category: 'فیلتر',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 2,
    name: 'لنت ترمز جلو پراید',
    slug: 'pride-front-brake-pads',
    brand: 'سایپا',
    modelId: 1,
    price: 450000,
    discount: 5,
    rating: 4.2,
    reviewCount: 95,
    image: '/images/products/brake-pads.jpg',
    category: 'ترمز',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 3,
    name: 'شمع پراید',
    slug: 'pride-spark-plugs',
    brand: 'بوش',
    modelId: 1,
    price: 320000,
    discount: 0,
    rating: 4.8,
    reviewCount: 210,
    image: '/images/products/spark-plugs.jpg',
    category: 'الکتریکی',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 4,
    name: 'تسمه تایم پراید',
    slug: 'pride-timing-belt',
    brand: 'دیناپارت',
    modelId: 1,
    price: 280000,
    discount: 15,
    rating: 4.0,
    reviewCount: 75,
    image: '/images/products/timing-belt.jpg',
    category: 'موتور',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 5,
    name: 'دیسک ترمز پراید',
    slug: 'pride-brake-disc',
    brand: 'سایپا',
    modelId: 1,
    price: 720000,
    discount: 8,
    rating: 4.3,
    reviewCount: 62,
    image: '/images/products/brake-disc.jpg',
    category: 'ترمز',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 6,
    name: 'رادیاتور پراید',
    slug: 'pride-radiator',
    brand: 'ایساکو',
    modelId: 1,
    price: 1250000,
    discount: 12,
    rating: 4.6,
    reviewCount: 48,
    image: '/images/products/radiator.jpg',
    category: 'خنک‌کننده',
    inStock: false,
    isOriginal: false,
  },
  
  // سمند
  {
    id: 7,
    name: 'فیلتر روغن سمند',
    slug: 'samand-oil-filter',
    brand: 'ایران خودرو',
    modelId: 8,
    price: 210000,
    discount: 5,
    rating: 4.4,
    reviewCount: 92,
    image: '/images/products/oil-filter.jpg',
    category: 'فیلتر',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 8,
    name: 'لنت ترمز جلو سمند',
    slug: 'samand-front-brake-pads',
    brand: 'ایران خودرو',
    modelId: 8,
    price: 520000,
    discount: 10,
    rating: 4.3,
    reviewCount: 87,
    image: '/images/products/brake-pads.jpg',
    category: 'ترمز',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 9,
    name: 'شمع سمند',
    slug: 'samand-spark-plugs',
    brand: 'بوش',
    modelId: 8,
    price: 380000,
    discount: 0,
    rating: 4.7,
    reviewCount: 156,
    image: '/images/products/spark-plugs.jpg',
    category: 'الکتریکی',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 10,
    name: 'تسمه تایم سمند',
    slug: 'samand-timing-belt',
    brand: 'دیناپارت',
    modelId: 8,
    price: 350000,
    discount: 8,
    rating: 4.1,
    reviewCount: 63,
    image: '/images/products/timing-belt.jpg',
    category: 'موتور',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 11,
    name: 'دیسک ترمز سمند',
    slug: 'samand-brake-disc',
    brand: 'ایران خودرو',
    modelId: 8,
    price: 850000,
    discount: 5,
    rating: 4.4,
    reviewCount: 58,
    image: '/images/products/brake-disc.jpg',
    category: 'ترمز',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 12,
    name: 'رادیاتور سمند',
    slug: 'samand-radiator',
    brand: 'ایساکو',
    modelId: 8,
    price: 1450000,
    discount: 10,
    rating: 4.5,
    reviewCount: 42,
    image: '/images/products/radiator.jpg',
    category: 'خنک‌کننده',
    inStock: true,
    isOriginal: false,
  },
];

// Get unique categories for filter
const categories = [...new Set(partsSampleData.map(part => part.category))];

const ModelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  
  // Find the model by ID
  const model = carModels.find(m => m.id === parseInt(id)) || carModels[0];
  
  // Filter parts for this model
  const modelParts = partsSampleData.filter(part => part.modelId === model.id);
  
  // Apply filters
  const filteredParts = modelParts.filter(part => {
    const matchesCategory = selectedCategory ? part.category === selectedCategory : true;
    const matchesBrand = selectedBrand ? part.brand === selectedBrand : true;
    return matchesCategory && matchesBrand;
  });
  
  // Sort parts
  const sortedParts = [...filteredParts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    // Default: popular (by review count)
    return b.reviewCount - a.reviewCount;
  });
  
  // Get unique brands for this model's parts
  const partBrands = [...new Set(modelParts.map(part => part.brand))];
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('popular');
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
        <Link 
          component={RouterLink} 
          to={`/brands/${model.brandSlug}`} 
          color="inherit"
        >
          {model.brand}
        </Link>
        <Typography color="text.primary">{model.name}</Typography>
      </Breadcrumbs>

      {/* Model Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #1976d2, #2196f3)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', right: -50, top: -50, opacity: 0.1, fontSize: 250 }}>
          <CarIcon fontSize="inherit" />
        </Box>
        
        <Grid container spacing={3} direction="row-reverse">
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                textAlign: 'right',
                direction: 'rtl',
              }}
            >
              {model.name}
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              paragraph 
              sx={{ 
                textAlign: 'right',
                direction: 'rtl',
              }}
            >
              {model.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Chip 
                icon={<SpeedIcon />} 
                label={`موتور: ${model.engine}`}
                sx={{ direction: 'rtl', bgcolor: 'rgba(255,255,255,0.2)' }}
              />
              <Chip 
                icon={<BuildIcon />} 
                label={`${model.partsCount} قطعه`}
                sx={{ direction: 'rtl', bgcolor: 'rgba(255,255,255,0.2)' }}
              />
              <Chip 
                label={`سال تولید: ${model.year}`}
                sx={{ direction: 'rtl', bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box 
              component="img"
              src={model.image || '/images/models/default-car.jpg'}
              alt={model.name}
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ direction: 'rtl' }}
        >
          <Tab label="قطعات یدکی" />
          <Tab label="مشخصات فنی" />
          <Tab label="مشکلات رایج" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {/* Parts Tab */}
        {currentTab === 0 && (
          <>
            {/* Filters */}
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Grid container spacing={3} alignItems="center" direction="row-reverse">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth sx={{ direction: 'rtl' }}>
                    <InputLabel id="category-select-label">دسته‌بندی قطعات</InputLabel>
                    <Select
                      labelId="category-select-label"
                      value={selectedCategory}
                      label="دسته‌بندی قطعات"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">همه دسته‌بندی‌ها</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth sx={{ direction: 'rtl' }}>
                    <InputLabel id="brand-select-label">برند قطعات</InputLabel>
                    <Select
                      labelId="brand-select-label"
                      value={selectedBrand}
                      label="برند قطعات"
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <MenuItem value="">همه برندها</MenuItem>
                      {partBrands.map((brand) => (
                        <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth sx={{ direction: 'rtl' }}>
                    <InputLabel id="sort-select-label">مرتب‌سازی</InputLabel>
                    <Select
                      labelId="sort-select-label"
                      value={sortBy}
                      label="مرتب‌سازی"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="popular">محبوب‌ترین</MenuItem>
                      <MenuItem value="price-low">قیمت: کم به زیاد</MenuItem>
                      <MenuItem value="price-high">قیمت: زیاد به کم</MenuItem>
                      <MenuItem value="rating">بیشترین امتیاز</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleClearFilters}
                    fullWidth
                    startIcon={<FilterIcon />}
                    sx={{ direction: 'rtl' }}
                  >
                    حذف فیلترها
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Parts List */}
            <Box sx={{ mb: 2 }}>
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
                  mb: 3,
                }}
              >
                <Typography variant="body1">
                  قطعات یدکی برای {model.name}
                </Typography>
                <Chip 
                  label={`${sortedParts.length} قطعه`} 
                  color="primary" 
                  variant="outlined" 
                />
              </Paper>
              
              <Grid container spacing={3}>
                {sortedParts.map((part) => (
                  <Grid item key={part.id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      {part.discount > 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: 'error.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            zIndex: 1,
                          }}
                        >
                          {part.discount}%
                        </Box>
                      )}
                      
                      <CardMedia
                        component="img"
                        height="160"
                        image={part.image}
                        alt={part.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                      
                      <CardContent sx={{ flexGrow: 1, direction: 'rtl' }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {part.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip 
                            label={part.category} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                          <Chip 
                            label={part.isOriginal ? 'اورجینال' : 'غیر اورجینال'} 
                            size="small" 
                            color={part.isOriginal ? 'success' : 'default'}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              برند: {part.brand}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography 
                                variant="h6" 
                                color="primary" 
                                sx={{ fontWeight: 'bold' }}
                              >
                                {part.price.toLocaleString()} تومان
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="small"
                          >
                            افزودن به سبد
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {sortedParts.length === 0 && (
                <Paper
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    borderRadius: 2,
                    direction: 'rtl',
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    هیچ قطعه‌ای با فیلترهای انتخاب شده یافت نشد
                  </Typography>
                </Paper>
              )}
            </Box>
          </>
        )}
        
        {/* Specifications Tab */}
        {currentTab === 1 && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, direction: 'rtl' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              مشخصات فنی {model.name}
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(model.specifications || {}).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(25, 118, 210, 0.05)', 
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
        
        {/* Common Issues Tab */}
        {currentTab === 2 && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, direction: 'rtl' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              مشکلات رایج {model.name}
            </Typography>
            
            <Grid container spacing={2}>
              {(model.commonIssues || []).map((issue, index) => (
                <Grid item xs={12} key={index}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(25, 118, 210, 0.05)', 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body1">
                      {issue}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default ModelDetail;
