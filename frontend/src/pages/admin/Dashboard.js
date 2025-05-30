import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  Person as UserIcon,
  Inventory as ProductIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data for the dashboard
  const stats = [
    {
      title: 'سفارشات امروز',
      value: '24',
      icon: <OrderIcon fontSize="large" />,
      color: '#4caf50',
    },
    {
      title: 'کاربران جدید',
      value: '15',
      icon: <UserIcon fontSize="large" />,
      color: '#2196f3',
    },
    {
      title: 'محصولات',
      value: '1,254',
      icon: <ProductIcon fontSize="large" />,
      color: '#ff9800',
    },
    {
      title: 'درآمد امروز',
      value: '۱,۲۵۰,۰۰۰ تومان',
      icon: <RevenueIcon fontSize="large" />,
      color: '#f44336',
    },
  ];

  const recentOrders = [
    { id: '#ORD-001', user: 'علی محمدی', date: '۱۴۰۴/۰۵/۰۸', amount: '۳۵۰,۰۰۰ تومان', status: 'تکمیل شده' },
    { id: '#ORD-002', user: 'سارا احمدی', date: '۱۴۰۴/۰۵/۰۸', amount: '۴۲۰,۰۰۰ تومان', status: 'در حال پردازش' },
    { id: '#ORD-003', user: 'محمد رضایی', date: '۱۴۰۴/۰۵/۰۷', amount: '۱,۱۵۰,۰۰۰ تومان', status: 'تکمیل شده' },
    { id: '#ORD-004', user: 'زهرا کریمی', date: '۱۴۰۴/۰۵/۰۷', amount: '۲۸۰,۰۰۰ تومان', status: 'در انتظار پرداخت' },
    { id: '#ORD-005', user: 'امیر حسینی', date: '۱۴۰۴/۰۵/۰۶', amount: '۵۶۰,۰۰۰ تومان', status: 'تکمیل شده' },
  ];

  const topProducts = [
    { name: 'فیلتر روغن تویوتا', sales: 87, revenue: '۸,۷۰۰,۰۰۰ تومان' },
    { name: 'لنت ترمز بوش', sales: 65, revenue: '۱۳,۰۰۰,۰۰۰ تومان' },
    { name: 'روغن موتور شل', sales: 59, revenue: '۱۱,۸۰۰,۰۰۰ تومان' },
    { name: 'باتری واریان', sales: 42, revenue: '۱۶,۸۰۰,۰۰۰ تومان' },
    { name: 'شمع NGK', sales: 38, revenue: '۳,۸۰۰,۰۰۰ تومان' },
  ];

  return (
    <>
      <AdminHeader />
      <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, direction: 'rtl' }}>
        داشبورد مدیریت
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderTop: `4px solid ${stat.color}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', direction: 'rtl' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {stat.title}
                </Typography>
                <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </Avatar>
              </Box>
              <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold', direction: 'rtl' }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={7}>
          <Card elevation={2}>
            <CardHeader 
              title={<Typography variant="h6" sx={{ direction: 'rtl' }}>سفارشات اخیر</Typography>} 
              sx={{ borderBottom: '1px solid #eee' }}
            />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%' }}>
                {recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 3, py: 2, direction: 'rtl' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#f5f5f5', color: '#1976d2' }}>
                          <OrderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography component="span" variant="body1" fontWeight="bold">
                              {order.id}
                            </Typography>
                            <Typography component="span" variant="body2">
                              {order.date}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography component="span" variant="body2" color="text.primary">
                              {order.user}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.primary">
                              {order.amount}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentOrders.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={5}>
          <Card elevation={2}>
            <CardHeader 
              title={<Typography variant="h6" sx={{ direction: 'rtl' }}>محصولات پرفروش</Typography>} 
              sx={{ borderBottom: '1px solid #eee' }}
            />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%' }}>
                {topProducts.map((product, index) => (
                  <React.Fragment key={product.name}>
                    <ListItem alignItems="flex-start" sx={{ px: 3, py: 2, direction: 'rtl' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#f5f5f5', color: '#ff9800' }}>
                          <ProductIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography component="span" variant="body1" fontWeight="bold">
                              {product.name}
                            </Typography>
                            <Typography component="span" variant="body2">
                              {product.sales} فروش
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Typography component="span" variant="body2" color="text.primary">
                              {product.revenue}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < topProducts.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Dashboard;
