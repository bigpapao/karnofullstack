import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  FilterAlt as FilterIcon,
  Speed as SpeedIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// Sample car models data
const carModels = [
  // سایپا
  {
    id: 1,
    name: 'پراید 111',
    brand: 'سایپا',
    brandId: 1,
    image: '/images/models/pride111.jpg',
    year: '1398-1401',
    engine: '1.3 لیتر',
    partsCount: 450,
    popular: true,
    description: 'پراید 111 یکی از پرفروش‌ترین خودروهای ایران با قطعات فراوان در بازار است.',
    category: 'هاچبک',
  },
  {
    id: 2,
    name: 'پراید 131',
    brand: 'سایپا',
    brandId: 1,
    image: '/images/models/pride131.jpg',
    year: '1395-1399',
    engine: '1.3 لیتر',
    partsCount: 480,
    popular: true,
    description: 'پراید 131 نسخه سدان پراید که به دلیل قیمت مناسب و قطعات در دسترس، همچنان پرطرفدار است.',
    category: 'سدان',
  },
  {
    id: 3,
    name: 'تیبا',
    brand: 'سایپا',
    brandId: 1,
    image: '/images/models/tiba.jpg',
    year: '1396-1402',
    engine: '1.5 لیتر',
    partsCount: 420,
    popular: true,
    description: 'تیبا جایگزین پراید در خط تولید سایپا با طراحی بهبود یافته و امکانات بیشتر.',
    category: 'سدان',
  },
  {
    id: 4,
    name: 'کوییک',
    brand: 'سایپا',
    brandId: 1,
    image: '/images/models/quick.jpg',
    year: '1397-1402',
    engine: '1.5 لیتر',
    partsCount: 380,
    popular: true,
    description: 'کوییک هاچبک اتوماتیک سایپا با طراحی مدرن و امکانات ایمنی بیشتر نسبت به سایر محصولات سایپا.',
    category: 'هاچبک',
  },
  {
    id: 5,
    name: 'شاهین',
    brand: 'سایپا',
    brandId: 1,
    image: '/images/models/shahin.jpg',
    year: '1400-1402',
    engine: '1.6 لیتر',
    partsCount: 320,
    popular: false,
    description: 'شاهین جدیدترین محصول سایپا با طراحی مدرن و پلتفرم جدید که جایگزین محصولات قدیمی سایپا شده است.',
    category: 'سدان',
  },
  
  // ایران خودرو
  {
    id: 6,
    name: 'پژو 206',
    brand: 'ایران خودرو',
    brandId: 2,
    image: '/images/models/206.jpg',
    year: '1385-1402',
    engine: '1.4 لیتر',
    partsCount: 520,
    popular: true,
    description: 'پژو 206 یکی از محبوب‌ترین خودروهای ایران با طراحی زیبا و عملکرد مناسب.',
    category: 'هاچبک',
  },
  {
    id: 7,
    name: 'پژو پارس',
    brand: 'ایران خودرو',
    brandId: 2,
    image: '/images/models/pars.jpg',
    year: '1390-1402',
    engine: '1.8 لیتر',
    partsCount: 490,
    popular: true,
    description: 'پژو پارس نسخه بهبود یافته پژو 405 با طراحی داخلی و خارجی متفاوت و امکانات بیشتر.',
    category: 'سدان',
  },
  {
    id: 8,
    name: 'سمند',
    brand: 'ایران خودرو',
    brandId: 2,
    image: '/images/models/samand.jpg',
    year: '1388-1402',
    engine: '1.7 لیتر',
    partsCount: 470,
    popular: true,
    description: 'سمند اولین خودروی ملی ایران که توسط ایران خودرو طراحی و تولید شده است.',
    category: 'سدان',
  },
  {
    id: 9,
    name: 'دنا',
    brand: 'ایران خودرو',
    brandId: 2,
    image: '/images/models/dena.jpg',
    year: '1394-1402',
    engine: '1.7 لیتر',
    partsCount: 450,
    popular: true,
    description: 'دنا نسخه بهبود یافته سمند با طراحی مدرن‌تر و امکانات بیشتر.',
    category: 'سدان',
  },
  {
    id: 10,
    name: 'رانا',
    brand: 'ایران خودرو',
    brandId: 2,
    image: '/images/models/runna.jpg',
    year: '1392-1402',
    engine: '1.6 لیتر',
    partsCount: 430,
    popular: false,
    description: 'رانا ترکیبی از پلتفرم پژو 206 و طراحی جدید که توسط ایران خودرو تولید می‌شود.',
    category: 'سدان',
  },
  
  // ام وی ام
  {
    id: 11,
    name: 'ام وی ام X22',
    brand: 'ام وی ام',
    brandId: 3,
    image: '/images/models/mvmx22.jpg',
    year: '1396-1402',
    engine: '1.5 لیتر',
    partsCount: 380,
    popular: true,
    description: 'ام وی ام X22 یک کراس‌اوور کامپکت با قیمت مناسب و امکانات خوب.',
    category: 'کراس‌اوور',
  },
  {
    id: 12,
    name: 'ام وی ام X33',
    brand: 'ام وی ام',
    brandId: 3,
    image: '/images/models/mvmx33.jpg',
    year: '1395-1401',
    engine: '2.0 لیتر',
    partsCount: 410,
    popular: true,
    description: 'ام وی ام X33 یک شاسی‌بلند کامپکت با طراحی مدرن و امکانات مناسب.',
    category: 'شاسی‌بلند',
  },
  {
    id: 13,
    name: 'ام وی ام 315',
    brand: 'ام وی ام',
    brandId: 3,
    image: '/images/models/mvm315.jpg',
    year: '1394-1400',
    engine: '1.5 لیتر',
    partsCount: 360,
    popular: false,
    description: 'ام وی ام 315 یک سدان کامپکت با قیمت مناسب و امکانات قابل قبول.',
    category: 'سدان',
  },
  
  // بهمن موتور
  {
    id: 14,
    name: 'مزدا 3',
    brand: 'بهمن موتور',
    brandId: 4,
    image: '/images/models/mazda3.jpg',
    year: '1397-1401',
    engine: '2.0 لیتر',
    partsCount: 390,
    popular: true,
    description: 'مزدا 3 یک سدان با کیفیت ژاپنی که توسط بهمن موتور در ایران مونتاژ می‌شود.',
    category: 'سدان',
  },
  {
    id: 15,
    name: 'دیگنیتی',
    brand: 'بهمن موتور',
    brandId: 4,
    image: '/images/models/dignity.jpg',
    year: '1400-1402',
    engine: '1.5 لیتر توربو',
    partsCount: 340,
    popular: false,
    description: 'دیگنیتی یک کراس‌اوور لوکس با امکانات فراوان که توسط بهمن موتور عرضه می‌شود.',
    category: 'کراس‌اوور',
  },
  {
    id: 16,
    name: 'فیدلیتی',
    brand: 'بهمن موتور',
    brandId: 4,
    image: '/images/models/fidelity.jpg',
    year: '1400-1402',
    engine: '1.5 لیتر توربو',
    partsCount: 330,
    popular: false,
    description: 'فیدلیتی یک شاسی‌بلند 5 و 7 نفره با امکانات خوب که توسط بهمن موتور عرضه می‌شود.',
    category: 'شاسی‌بلند',
  },
];

// Get unique brands for filter
const brands = [...new Set(carModels.map(model => model.brand))];
// Get unique categories for filter
const categories = [...new Set(carModels.map(model => model.category))];

const ModelCard = ({ model }) => {
  const navigate = useNavigate();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        },
      }}
    >
      {model.popular && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bgcolor: 'secondary.main',
            color: 'white',
            zIndex: 2,
            px: 1,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            borderBottomLeftRadius: 8,
          }}
        >
          پرطرفدار
        </Box>
      )}
      
      {/* Card media and title - clickable as a whole */}
      <CardActionArea 
        onClick={() => navigate(`/models/${model.id}`)}
        sx={{ flexGrow: 0 }}
      >
        <CardMedia
          component="img"
          height="160"
          image={model.image || '/images/models/default-car.jpg'}
          alt={model.name}
          sx={{
            objectFit: 'cover',
          }}
        />
        
        <CardContent sx={{ p: 2, pb: 1, direction: 'rtl' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              {model.name}
            </Typography>
            <Chip 
              label={model.brand} 
              size="small" 
              color="primary"
              sx={{ direction: 'rtl' }}
            />
          </Box>
          
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SpeedIcon fontSize="small" sx={{ ml: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {model.engine}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {model.year}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      
      {/* Description and actions - not part of the clickable area */}
      <CardContent sx={{ flexGrow: 1, pt: 0, p: 2, direction: 'rtl' }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '3em',
            textAlign: 'right',
          }}
        >
          {model.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary"
            sx={{ fontSize: '0.75rem' }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the CardActionArea click
              navigate(`/products?model=${model.id}`);
            }}
          >
            مشاهده قطعات
          </Button>
          <Chip
            label={`${model.partsCount} قطعه`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ direction: 'rtl' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Models = () => {
  // State for models
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const location = useLocation();
  
  // Set initial brand filter from URL params if coming from brand page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brandParam = params.get('brand');
    
    // Map brand slugs to brand names (this would come from API in real app)
    const brandMapping = {
      'saipa': 'سایپا',
      'irankhodro': 'ایران خودرو',
      'mvm': 'ام وی ام',
      'bahmanmotor': 'بهمن موتور',
      'kia': 'کیا',
      'hyundai': 'هیوندای',
      'renault': 'رنو',
      'geely': 'جیلی'
    };
    
    if (brandParam && brandMapping[brandParam]) {
      setSelectedBrand(brandMapping[brandParam]);
    }
  }, [location]);
  
  // Filter models based on search and filters
  const filteredModels = carModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand ? model.brand === selectedBrand : true;
    const matchesType = selectedType ? model.category === selectedType : true;
    
    return matchesSearch && matchesBrand && matchesType;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const displayedModels = filteredModels.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearFilters = () => {
    setSelectedBrand('');
    setSelectedType('');
    setSearchQuery('');
  };
  
  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #f5f7fa, #ffffff)',
      minHeight: '100vh',
      py: 6,
    }}>
      <Container maxWidth="lg">
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
            مدل‌های خودرو
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
            قطعات اصلی و با کیفیت برای تمامی مدل‌های خودروهای ایرانی و خارجی
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center" direction="row-reverse">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="جستجوی مدل خودرو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button 
                  variant={showFilters ? "contained" : "outlined"} 
                  color="primary" 
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ direction: 'rtl' }}
                >
                  فیلترها
                </Button>
                {(selectedBrand || selectedType) && (
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleClearFilters}
                    sx={{ direction: 'rtl' }}
                  >
                    حذف فیلترها
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
          
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3} direction="row-reverse">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ direction: 'rtl' }}>
                    <InputLabel id="brand-select-label">برند خودرو</InputLabel>
                    <Select
                      labelId="brand-select-label"
                      value={selectedBrand}
                      label="برند خودرو"
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <MenuItem value="">همه برندها</MenuItem>
                      {brands.map((brand) => (
                        <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ direction: 'rtl' }}>
                    <InputLabel id="category-select-label">نوع خودرو</InputLabel>
                    <Select
                      labelId="category-select-label"
                      value={selectedType}
                      label="نوع خودرو"
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <MenuItem value="">همه انواع</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

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
              <SettingsIcon color="primary" sx={{ ml: 1 }} />
              <Typography variant="body1">
                قطعات یدکی اصل برای تمام مدل‌های خودرو
              </Typography>
            </Box>
            <Chip 
              label={`${filteredModels.length} مدل`} 
              color="primary" 
              variant="outlined" 
            />
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {displayedModels.map((model) => (
            <Grid item key={model.id} xs={12} sm={6} md={4}>
              <ModelCard model={model} />
            </Grid>
          ))}
        </Grid>

        {filteredModels.length === 0 && (
          <Paper
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: 2,
              direction: 'rtl',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              هیچ مدلی مطابق با معیارهای جستجوی شما یافت نشد
            </Typography>
          </Paper>
        )}
        
        {filteredModels.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Models;
