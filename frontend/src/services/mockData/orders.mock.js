export const mockOrders = [
  {
    id: 1,
    userId: 101,
    orderNumber: 'KRN-24020001',
    items: [
      {
        productId: 1,
        name: 'روغن موتور سینتیوم 5W-40',
        quantity: 2,
        price: 850000,
        total: 1700000
      },
      {
        productId: 2,
        name: 'فیلتر روغن پژو 206',
        quantity: 1,
        price: 180000,
        total: 180000
      }
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'zarinpal',
    shippingAddress: {
      fullName: 'علی محمدی',
      address: 'تهران، خیابان ستارخان، پلاک 123',
      phone: '09123456789',
      postalCode: '1234567890'
    },
    subtotal: 1880000,
    shippingCost: 50000,
    total: 1930000,
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-02-03T14:20:00Z',
    deliveredAt: '2024-02-03T14:20:00Z'
  },
  {
    id: 2,
    userId: 102,
    orderNumber: 'KRN-24020002',
    items: [
      {
        productId: 3,
        name: 'لنت ترمز جلو سمند',
        quantity: 1,
        price: 450000,
        total: 450000
      }
    ],
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'zarinpal',
    shippingAddress: {
      fullName: 'رضا کریمی',
      address: 'اصفهان، خیابان چهارباغ، کوچه گلها، پلاک 45',
      phone: '09187654321',
      postalCode: '8765432109'
    },
    subtotal: 450000,
    shippingCost: 50000,
    total: 500000,
    createdAt: '2024-02-03T09:15:00Z',
    updatedAt: '2024-02-03T09:15:00Z'
  },
  {
    id: 3,
    userId: 103,
    orderNumber: 'KRN-24020003',
    items: [
      {
        productId: 1,
        name: 'روغن موتور سینتیوم 5W-40',
        quantity: 1,
        price: 850000,
        total: 850000
      }
    ],
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'zarinpal',
    shippingAddress: {
      fullName: 'مریم احمدی',
      address: 'شیراز، بلوار زند، کوچه 12، پلاک 78',
      phone: '09198765432',
      postalCode: '7654321098'
    },
    subtotal: 850000,
    shippingCost: 50000,
    total: 900000,
    createdAt: '2024-02-03T15:45:00Z',
    updatedAt: '2024-02-03T15:45:00Z'
  }
];

export const getOrders = () => {
  return Promise.resolve(mockOrders);
};

export const getOrderById = (id) => {
  const order = mockOrders.find(o => o.id === parseInt(id));
  return Promise.resolve(order || null);
};

export const getOrdersByUserId = (userId) => {
  const orders = mockOrders.filter(o => o.userId === parseInt(userId));
  return Promise.resolve(orders);
};

export const updateOrderStatus = (id, status) => {
  const index = mockOrders.findIndex(o => o.id === parseInt(id));
  if (index === -1) return Promise.reject(new Error('Order not found'));
  
  mockOrders[index] = {
    ...mockOrders[index],
    status,
    updatedAt: new Date().toISOString(),
    ...(status === 'delivered' ? { deliveredAt: new Date().toISOString() } : {})
  };
  return Promise.resolve(mockOrders[index]);
};

export const createOrder = (orderData) => {
  const newOrder = {
    ...orderData,
    id: mockOrders.length + 1,
    orderNumber: `KRN-${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${(mockOrders.length + 1).toString().padStart(4, '0')}`,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockOrders.push(newOrder);
  return Promise.resolve(newOrder);
}; 