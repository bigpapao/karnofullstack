import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AddShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  ElectricalServices as ElectricalServicesIcon,
  BatteryChargingFull as BatteryChargingFullIcon,
  AcUnit as AcUnitIcon,
  Opacity as OilIcon, // Using a drop icon as a substitute for oil
  Brightness1 as BrakesIcon, // Using a circle icon as a substitute for brakes
  RadioButtonChecked as TireIcon, // Using a circle icon as a substitute for tires
  Lightbulb as LightbulbIcon,
  DirectionsCar as DirectionsCarIcon,
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { toPersianCurrency, toPersianNumber } from '../utils/persianUtils';

// Default placeholder image for products
const placeholderImage = '/images/products/placeholder.jpg';

// Helper function to get category icon based on category name
const getCategoryIcon = (category) => {
  switch(category) {
    case 'Engine':
    case 'موتور':
      return <SettingsIcon fontSize="large" className="no-flip" />;
    case 'Electrical':
    case 'برقی':
      return <ElectricalServicesIcon fontSize="large" className="no-flip" />;
    case 'Battery':
    case 'باتری':
      return <BatteryChargingFullIcon fontSize="large" className="no-flip" />;
    case 'AC':
    case 'تهویه':
    case 'Air Conditioning':
      return <AcUnitIcon fontSize="large" className="no-flip" />;
    case 'Oil':
    case 'روغن':
      return <OilIcon fontSize="large" className="no-flip" />;
    case 'Brakes':
    case 'ترمز':
      return <BrakesIcon fontSize="large" className="no-flip" />;
    case 'Tires':
    case 'لاستیک':
      return <TireIcon fontSize="large" className="no-flip" />;
    case 'Lights':
    case 'چراغ':
    case 'روشنایی':
      return <LightbulbIcon fontSize="large" className="no-flip" />;
    case 'Suspension':
    case 'تعلیق':
      return <DirectionsCarIcon fontSize="large" className="no-flip" />;
    default:
      return <BuildIcon fontSize="large" className="no-flip" />;
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

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [favorite, setFavorite] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  // Get appropriate image based on whether we're showing a placeholder
  const getImage = (product) => {
    return product?.images?.length > 0 
      ? product.images[0].url 
      : placeholderImage;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/products/${product.slug}`}
        sx={{ flexGrow: 1 }}
      >
        {product.discountPrice && (
          <Chip
            label={`تخفیف`}
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          />
        )}
        {product.inStock === false && (
          <Chip
            label={`ناموجود`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: product.discountPrice ? 40 : 8,
              right: 8,
              zIndex: 1,
            }}
          />
        )}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
          onClick={handleToggleFavorite}
        >
          {favorite ? (
            <FavoriteIcon color="secondary" className="no-flip" />
          ) : (
            <FavoriteBorderIcon className="no-flip" />
          )}
        </IconButton>
        {product.image ? (
          <CardMedia
            component="img"
            height="200"
            image={product.image.startsWith('/') ? product.image : `/images/Products/${product.image}`}
            alt={product.name}
            sx={{
              objectFit: 'contain',
              bgcolor: 'background.paper',
              p: 2,
              filter: product.inStock === false ? 'grayscale(0.8) opacity(0.7)' : 'none',
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            {getCategoryIcon(product.category)}
          </Box>
        )}

        <CardContent>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div"
            sx={{ minHeight: 64 }}
          >
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              name={`rating-${product.id}`}
              value={product.rating || 0}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({toPersianNumber(product.reviewCount || 0)})
            </Typography>
          </Box>
          
          {product.brand && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
               برند: {product.brand}
            </Typography>
          )}
          
          {product.category && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              دسته‌بندی: {product.category}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {product.discountPrice ? (
            <>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textDecoration: 'line-through' }}
                className="persian-price"
              >
                {toPersianCurrency(product.price)}
              </Typography>
              <Typography 
                variant="h6" 
                color="secondary"
                className="persian-price"
              >
                {toPersianCurrency(product.discountPrice)}
              </Typography>
            </>
          ) : (
            <Typography 
              variant="h6" 
              color="primary"
              className="persian-price"
            >
              {toPersianCurrency(product.price)}
            </Typography>
          )}
        </Box>
        
        <Tooltip title={product.inStock === false ? "ناموجود" : "افزودن به سبد خرید"}>
          <span>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CartIcon className="no-flip" />}
              onClick={handleAddToCart}
              disabled={product.inStock === false}
            >
              خرید
            </Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProductCard;