export const getDashboardStats = () => {
  return Promise.resolve({
    totalSales: 3330000,
    totalOrders: 3,
    totalProducts: 3,
    totalUsers: 4,
    recentOrders: [
      {
        id: 3,
        orderNumber: 'KRN-24020003',
        customerName: 'مریم احمدی',
        total: 900000,
        status: 'pending',
        createdAt: '2024-02-03T15:45:00Z'
      },
      {
        id: 2,
        orderNumber: 'KRN-24020002',
        customerName: 'رضا کریمی',
        total: 500000,
        status: 'processing',
        createdAt: '2024-02-03T09:15:00Z'
      },
      {
        id: 1,
        orderNumber: 'KRN-24020001',
        customerName: 'علی محمدی',
        total: 1930000,
        status: 'delivered',
        createdAt: '2024-02-01T10:30:00Z'
      }
    ],
    topProducts: [
      {
        id: 1,
        name: 'روغن موتور سینتیوم 5W-40',
        totalSold: 3,
        revenue: 2550000
      },
      {
        id: 2,
        name: 'فیلتر روغن پژو 206',
        totalSold: 1,
        revenue: 180000
      },
      {
        id: 3,
        name: 'لنت ترمز جلو سمند',
        totalSold: 1,
        revenue: 450000
      }
    ],
    salesChart: {
      labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      data: [
        2500000,
        3100000,
        2800000,
        3500000,
        4200000,
        3800000,
        4500000,
        5100000,
        4800000,
        5500000,
        6200000,
        3330000
      ]
    },
    orderStatusChart: {
      labels: ['در انتظار پرداخت', 'در حال پردازش', 'تحویل شده', 'لغو شده'],
      data: [1, 1, 1, 0]
    },
    recentActivities: [
      {
        id: 1,
        type: 'order',
        message: 'سفارش جدید ثبت شد',
        details: 'سفارش KRN-24020003 توسط مریم احمدی',
        timestamp: '2024-02-03T15:45:00Z'
      },
      {
        id: 2,
        type: 'status',
        message: 'تغییر وضعیت سفارش',
        details: 'سفارش KRN-24020002 به وضعیت در حال پردازش تغییر کرد',
        timestamp: '2024-02-03T09:15:00Z'
      },
      {
        id: 3,
        type: 'delivery',
        message: 'تحویل سفارش',
        details: 'سفارش KRN-24020001 با موفقیت تحویل داده شد',
        timestamp: '2024-02-03T14:20:00Z'
      }
    ]
  });
};

export const getInventoryAlerts = () => {
  return Promise.resolve({
    lowStock: [
      {
        id: 1,
        name: 'روغن موتور سینتیوم 5W-40',
        currentStock: 50,
        minStock: 100,
        reorderPoint: 75
      }
    ],
    outOfStock: []
  });
};

export const getSalesReport = (startDate, endDate) => {
  return Promise.resolve({
    totalSales: 3330000,
    totalOrders: 3,
    averageOrderValue: 1110000,
    topCategories: [
      {
        name: 'روغن موتور',
        sales: 2550000,
        percentage: 76.6
      },
      {
        name: 'فیلتر',
        sales: 180000,
        percentage: 5.4
      },
      {
        name: 'لنت ترمز',
        sales: 450000,
        percentage: 13.5
      }
    ],
    dailySales: [
      {
        date: '2024-02-01',
        sales: 1930000,
        orders: 1
      },
      {
        date: '2024-02-02',
        sales: 0,
        orders: 0
      },
      {
        date: '2024-02-03',
        sales: 1400000,
        orders: 2
      }
    ]
  });
}; 