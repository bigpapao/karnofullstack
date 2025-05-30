import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
} from '@mui/material';

const Orders = () => {
  // This would typically come from your Redux store
  const orders = [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    Order #{order.orderNumber}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'Delivered'
                        ? 'success'
                        : order.status === 'Processing'
                        ? 'warning'
                        : 'default'
                    }
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography color="text.secondary">
                    Ordered on {new Date(order.date).toLocaleDateString()}
                  </Typography>
                  <Typography color="text.secondary">
                    Total: ${order.total}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {order.items.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                          }}
                        />
                        <Box>
                          <Typography variant="body2">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {orders.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center">No orders found</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Orders;
