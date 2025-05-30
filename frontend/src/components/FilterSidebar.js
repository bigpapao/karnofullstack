import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const defaultFilters = {
  price: [0, 1000],
  category: [],
  availability: 'all',
  rating: 0,
  brand: null,
};

// Available brands with their logos
const availableBrands = [
  { id: 'سایپا', name: 'سایپا', logo: 'images/brands/Saipa_Logo.png' },
  { id: 'ایران خودرو', name: 'ایران خودرو', logo: 'images/brands/iran-khodro-logo.png' },
  { id: 'ام وی ام', name: 'ام وی ام', logo: 'images/brands/MVM_logo.png' },
  { id: 'بهمن موتور', name: 'بهمن موتور', logo: 'images/brands/Bahman_motor_Logo.png' },
];

const FilterSidebar = ({
  open = false,
  onClose = () => {},
  filters = defaultFilters,
  onChange = () => {},
  onClear = () => {},
  mobile = false,
  type = 'product',
  title = 'فیلترها',
  buttonText = 'حذف همه فیلترها',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || mobile;

  const {
    price = defaultFilters.price,
    category = defaultFilters.category,
    availability = defaultFilters.availability,
    rating = defaultFilters.rating,
    brand = defaultFilters.brand,
  } = filters || {};

  const handlePriceChange = (event, newValue) => {
    onChange('price', newValue);
  };
  
  const handleBrandSelect = (selectedBrand) => {
    onChange('brand', selectedBrand === brand ? null : selectedBrand);
  };

  const drawerContent = (
    <Box sx={{ width: 280, p: 3, direction: 'rtl' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {isMobile && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={onClear}
        sx={{ mb: 3 }}
      >
        {buttonText}
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range */}
      <Typography variant="subtitle1" gutterBottom>
        محدوده قیمت
      </Typography>
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={price}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={10}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography variant="body2">{price[0]} هزار تومان</Typography>
          <Typography variant="body2">{price[1]} هزار تومان</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Brands */}
      {type === 'product' && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            برندها
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {availableBrands.map((brandItem) => (
              <Chip
                key={brandItem.id}
                avatar={<Avatar alt={brandItem.name} src={brandItem.logo} />}
                label={brandItem.name}
                onClick={() => handleBrandSelect(brandItem.id)}
                variant={brand === brandItem.id ? "filled" : "outlined"}
                color={brand === brandItem.id ? "primary" : "default"}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      {/* Categories */}
      <Typography variant="subtitle1" gutterBottom>
        دسته‌بندی‌ها
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {[
          { id: 'Engine', name: 'موتور' },
          { id: 'Electrical', name: 'برق' },
          { id: 'Battery', name: 'باتری' },
          { id: 'Oil', name: 'روغن' },
          { id: 'Brakes', name: 'ترمز' },
          { id: 'Tires', name: 'لاستیک' },
          { id: 'Lights', name: 'چراغ‌ها' },
          { id: 'Suspension', name: 'سیستم تعلیق' }
        ].map((cat) => (
          <Chip
            key={cat.id}
            label={cat.name}
            onClick={() => onChange('category', category.includes(cat.id) ? 
              category.filter(c => c !== cat.id) : 
              [...category, cat.id])}
            variant={category.includes(cat.id) ? "filled" : "outlined"}
            color={category.includes(cat.id) ? "primary" : "default"}
            sx={{ mb: 1 }}
          />
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Availability */}
      <Typography variant="subtitle1" gutterBottom>
        موجودی
      </Typography>
      <RadioGroup
        value={availability}
        onChange={(e) => onChange('availability', e.target.value)}
        sx={{ mb: 3 }}
      >
        <FormControlLabel
          value="all"
          control={<Radio />}
          label="همه محصولات"
        />
        <FormControlLabel
          value="inStock"
          control={<Radio />}
          label="فقط موجود"
        />
        <FormControlLabel
          value="onSale"
          control={<Radio />}
          label="فقط تخفیف‌دار"
        />
      </RadioGroup>

      <Divider sx={{ mb: 3 }} />

      {/* Rating */}
      <Typography variant="subtitle1" gutterBottom>
        امتیاز
      </Typography>
      <RadioGroup
        value={rating}
        onChange={(e) => onChange('rating', Number(e.target.value))}
        sx={{ mb: 3 }}
      >
        {[4, 3, 2, 1].map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={`${value}+ ستاره`}
          />
        ))}
      </RadioGroup>

      <Divider sx={{ mb: 3 }} />
    </Box>
  );

  return isMobile ? (
    <Drawer anchor="right" open={open} onClose={onClose}>
      {drawerContent}
    </Drawer>
  ) : (
    <Box
      component="aside"
      sx={{
        width: 280,
        flexShrink: 0,
        borderLeft: 1,
        borderColor: 'divider',
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default FilterSidebar;
