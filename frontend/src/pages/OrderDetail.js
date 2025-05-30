import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  Chip, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Status mapping for visualization
const orderStatusMap = {
  'pending': { color: 'warning', icon: <ScheduleIcon />, label: 'در انتظار پرداخت' },
  'processing': { color: 'info', icon: <LocalShippingIcon />, label: 'در حال پردازش' },
  'shipped': { color: 'primary', icon: <LocalShippingIcon />, label: 'ارسال شده' },
  'delivered': { color: 'success', icon: <CheckCircleIcon />, label: 'تحویل داده شده' },
  'cancelled': { color: 'error', icon: <CancelIcon />, label: 'لغو شده' },
};

// Sample order data - in production this would come from an API
const sampleOrder = {
  id: '123456',
  date: '1403/03/15',
  status: 'processing',
  paymentMethod: 'کارت بانکی',
  paymentStatus: 'پرداخت شده',
  shipping: {
    address: 'تهران، خیابان ولیعصر، کوچه بهار، پلاک 12، واحد 3',
    city: 'تهران',
    postalCode: '1234567890',
    phone: '09123456789',
    trackingNumber: 'TRK123456789',
  },
  items: [
    {
      id: 1,
      name: 'گارد محافظ گوشی مدل A52',
      price: 1250000,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      name: 'محافظ صفحه نمایش گلس',
      price: 850000,
      quantity: 2,
      image: 'https://via.placeholder.com/80',
    },
  ],
  totals: {
    subtotal: 2950000,
    shipping: 350000,
    discount: 500000,
    total: 2800000,
  },
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Simulating API call to fetch order details
    const fetchOrder = () => {
      setLoading(true);
      
      // In production, replace this with an actual API call
      setTimeout(() => {
        // Pretend this is data from the API
        setOrder(sampleOrder);
        setLoading(false);
      }, 800);
    };

    if (isAuthenticated && orderId) {
      fetchOrder();
    } else {
      setError('برای مشاهده سفارش باید وارد شوید');
      setLoading(false);
    }
  }, [orderId, isAuthenticated]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          ورود به سایت
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>سفارش مورد نظر یافت نشد</Alert>
        <Button
          component={RouterLink}
          to="/orders"
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          بازگشت به لیست سفارش‌ها
        </Button>
      </Container>
    );
  }

  const { status, date, items, totals, shipping, paymentMethod, paymentStatus } = order;
  const statusInfo = orderStatusMap[status] || { color: 'default', icon: <ScheduleIcon />, label: status };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={RouterLink}
          to="/orders"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          بازگشت به سفارش‌ها
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            سفارش #{orderId}
          </Typography>
          <Chip 
            icon={statusInfo.icon} 
            label={statusInfo.label}
            color={statusInfo.color}
          />
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          تاریخ سفارش: {date}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              محصولات سفارش
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>محصول</TableCell>
                    <TableCell align="right">قیمت</TableCell>
                    <TableCell align="center">تعداد</TableCell>
                    <TableCell align="right">مجموع</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 50, height: 50, marginRight: 2, borderRadius: 1 }}
                          />
                          <Typography variant="body2">{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {item.price.toLocaleString()} تومان
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {(item.price * item.quantity).toLocaleString()} تومان
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              آدرس تحویل
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">{shipping.address}</Typography>
              <Typography variant="body1">{shipping.city}</Typography>
              <Typography variant="body1">کد پستی: {shipping.postalCode}</Typography>
              <Typography variant="body1">شماره تماس: {shipping.phone}</Typography>
              
              {shipping.trackingNumber && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    کد رهگیری پستی:
                  </Typography>
                  <Chip 
                    label={shipping.trackingNumber} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                خلاصه پرداخت
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">مجموع محصولات:</Typography>
                  <Typography variant="body2">{totals.subtotal.toLocaleString()} تومان</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">هزینه ارسال:</Typography>
                  <Typography variant="body2">{totals.shipping.toLocaleString()} تومان</Typography>
                </Box>
                {totals.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">تخفیف:</Typography>
                    <Typography variant="body2" color="error.main">
                      {totals.discount.toLocaleString()} - تومان
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    مبلغ کل:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {totals.total.toLocaleString()} تومان
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                اطلاعات پرداخت
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    روش پرداخت: {paymentMethod}
                  </Typography>
                </Box>
                <Chip 
                  label={`وضعیت پرداخت: ${paymentStatus}`}
                  color={paymentStatus === 'پرداخت شده' ? 'success' : 'warning'}
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail; 