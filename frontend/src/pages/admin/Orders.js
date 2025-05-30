import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

const Orders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data for orders
  const orders = [
    { 
      id: '#ORD-001', 
      customer: 'علی محمدی', 
      date: '۱۴۰۴/۰۵/۰۸', 
      total: '۳۵۰,۰۰۰ تومان', 
      status: 'تکمیل شده',
      payment: 'آنلاین',
      items: [
        { product: 'فیلتر روغن تویوتا', quantity: 1, price: '۱۰۰,۰۰۰ تومان' },
        { product: 'روغن موتور شل', quantity: 1, price: '۱۵۰,۰۰۰ تومان' },
        { product: 'فیلتر هوا هیوندای', quantity: 1, price: '۹۰,۰۰۰ تومان' }
      ],
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      phone: '۰۹۱۲۳۴۵۶۷۸۹'
    },
    { 
      id: '#ORD-002', 
      customer: 'سارا احمدی', 
      date: '۱۴۰۴/۰۵/۰۸', 
      total: '۴۲۰,۰۰۰ تومان', 
      status: 'در حال پردازش',
      payment: 'آنلاین',
      items: [
        { product: 'لنت ترمز بوش', quantity: 1, price: '۲۰۰,۰۰۰ تومان' },
        { product: 'روغن ترمز موبیل', quantity: 1, price: '۱۲۰,۰۰۰ تومان' },
        { product: 'شمع NGK', quantity: 1, price: '۸۰,۰۰۰ تومان' }
      ],
      address: 'اصفهان، خیابان چهارباغ، کوچه گلها، پلاک ۴۵',
      phone: '۰۹۱۳۱۲۳۴۵۶۷'
    },
    { 
      id: '#ORD-003', 
      customer: 'محمد رضایی', 
      date: '۱۴۰۴/۰۵/۰۷', 
      total: '۱,۱۵۰,۰۰۰ تومان', 
      status: 'تکمیل شده',
      payment: 'پرداخت در محل',
      items: [
        { product: 'کمک فنر کیا', quantity: 2, price: '۹۶۰,۰۰۰ تومان' },
        { product: 'روغن موتور شل', quantity: 1, price: '۱۵۰,۰۰۰ تومان' }
      ],
      address: 'مشهد، بلوار وکیل آباد، پلاک ۷۸',
      phone: '۰۹۱۵۱۲۳۴۵۶۷'
    },
    { 
      id: '#ORD-004', 
      customer: 'زهرا کریمی', 
      date: '۱۴۰۴/۰۵/۰۷', 
      total: '۲۸۰,۰۰۰ تومان', 
      status: 'در انتظار پرداخت',
      payment: 'آنلاین',
      items: [
        { product: 'فیلتر هوا هیوندای', quantity: 1, price: '۹۰,۰۰۰ تومان' },
        { product: 'شمع NGK', quantity: 2, price: '۱۶۰,۰۰۰ تومان' }
      ],
      address: 'شیراز، خیابان زند، کوچه ۱۲، پلاک ۳۴',
      phone: '۰۹۱۷۱۲۳۴۵۶۷'
    },
    { 
      id: '#ORD-005', 
      customer: 'امیر حسینی', 
      date: '۱۴۰۴/۰۵/۰۶', 
      total: '۵۶۰,۰۰۰ تومان', 
      status: 'تکمیل شده',
      payment: 'آنلاین',
      items: [
        { product: 'دیسک ترمز فرانو', quantity: 1, price: '۳۵۰,۰۰۰ تومان' },
        { product: 'روغن ترمز موبیل', quantity: 1, price: '۱۲۰,۰۰۰ تومان' },
        { product: 'شمع NGK', quantity: 1, price: '۸۰,۰۰۰ تومان' }
      ],
      address: 'تبریز، خیابان امام، کوچه بهار، پلاک ۵۶',
      phone: '۰۹۱۴۱۲۳۴۵۶۷'
    },
    { 
      id: '#ORD-006', 
      customer: 'رضا محمودی', 
      date: '۱۴۰۴/۰۵/۰۶', 
      total: '۴۰۰,۰۰۰ تومان', 
      status: 'ارسال شده',
      payment: 'آنلاین',
      items: [
        { product: 'باتری واریان', quantity: 1, price: '۴۰۰,۰۰۰ تومان' }
      ],
      address: 'اهواز، کیانپارس، خیابان ۵، پلاک ۲۳',
      phone: '۰۹۱۶۱۲۳۴۵۶۷'
    },
    { 
      id: '#ORD-007', 
      customer: 'مریم صادقی', 
      date: '۱۴۰۴/۰۵/۰۵', 
      total: '۱۸۰,۰۰۰ تومان', 
      status: 'تکمیل شده',
      payment: 'پرداخت در محل',
      items: [
        { product: 'تسمه تایم گیتس', quantity: 1, price: '۱۸۰,۰۰۰ تومان' }
      ],
      address: 'کرج، مهرشهر، بلوار ارم، پلاک ۱۲',
      phone: '۰۹۱۲۳۴۵۶۷۸۹'
    },
  ];

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = () => {
    // Here you would typically update the order status in your backend
    // For now, we'll just close the dialog
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'تکمیل شده':
        return 'success';
      case 'در حال پردازش':
        return 'info';
      case 'ارسال شده':
        return 'primary';
      case 'در انتظار پرداخت':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, direction: 'rtl' }}>
        مدیریت سفارشات
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو بر اساس شماره سفارش، نام مشتری یا وضعیت..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { direction: 'rtl' }
            }}
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="right">شماره سفارش</TableCell>
                <TableCell align="right">مشتری</TableCell>
                <TableCell align="right">تاریخ</TableCell>
                <TableCell align="right">مبلغ کل</TableCell>
                <TableCell align="right">وضعیت</TableCell>
                <TableCell align="right">روش پرداخت</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell align="right">{order.id}</TableCell>
                    <TableCell align="right">{order.customer}</TableCell>
                    <TableCell align="right">{order.date}</TableCell>
                    <TableCell align="right">{order.total}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{order.payment}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewOrder(order)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="secondary">
                        <PrintIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در هر صفحه:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ direction: 'rtl' }}>
          جزئیات سفارش {selectedOrder?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box sx={{ direction: 'rtl' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">اطلاعات مشتری</Typography>
                  <Typography variant="body1">نام: {selectedOrder.customer}</Typography>
                  <Typography variant="body1">تلفن: {selectedOrder.phone}</Typography>
                  <Typography variant="body1">آدرس: {selectedOrder.address}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">اطلاعات سفارش</Typography>
                  <Typography variant="body1">تاریخ: {selectedOrder.date}</Typography>
                  <Typography variant="body1">روش پرداخت: {selectedOrder.payment}</Typography>
                  <Typography variant="body1">
                    وضعیت: 
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status)}
                      size="small"
                      sx={{ mr: 1, ml: 1 }}
                    />
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold">اقلام سفارش</Typography>
              <List>
                {selectedOrder.items.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${item.product} (${item.quantity} عدد)`}
                      secondary={item.price}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">مبلغ کل:</Typography>
                <Typography variant="h6" fontWeight="bold">{selectedOrder.total}</Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">تغییر وضعیت سفارش</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="status-label">وضعیت</InputLabel>
                  <Select
                    labelId="status-label"
                    defaultValue={selectedOrder.status}
                    label="وضعیت"
                  >
                    <MenuItem value="در انتظار پرداخت">در انتظار پرداخت</MenuItem>
                    <MenuItem value="در حال پردازش">در حال پردازش</MenuItem>
                    <MenuItem value="ارسال شده">ارسال شده</MenuItem>
                    <MenuItem value="تکمیل شده">تکمیل شده</MenuItem>
                    <MenuItem value="لغو شده">لغو شده</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary">
            به‌روزرسانی وضعیت
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
