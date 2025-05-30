import api from './api';
import { getDashboardStats, getInventoryAlerts, getSalesReport } from './mockData/dashboard.mock';
import { getUsers, updateUserStatus } from './mockData/users.mock';
import { getOrders, updateOrderStatus } from './mockData/orders.mock';

const USE_MOCK = true; // Toggle this to switch between mock and real API

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    if (USE_MOCK) {
      return getDashboardStats();
    }
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getInventoryAlerts: async () => {
    if (USE_MOCK) {
      return getInventoryAlerts();
    }
    const response = await api.get('/admin/dashboard/inventory-alerts');
    return response.data;
  },

  getSalesReport: async (startDate, endDate) => {
    if (USE_MOCK) {
      return getSalesReport(startDate, endDate);
    }
    const response = await api.get('/admin/dashboard/sales-report', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    if (USE_MOCK) {
      return getUsers();
    }
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    if (USE_MOCK) {
      return updateUserStatus(userId, status);
    }
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  // Order Management
  getOrders: async (params = {}) => {
    if (USE_MOCK) {
      return getOrders();
    }
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    if (USE_MOCK) {
      return updateOrderStatus(orderId, status);
    }
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Security Monitoring
  getSecurityEvents: async (params = {}) => {
    if (USE_MOCK) {
      return Promise.resolve({
        events: [],
        total: 0
      });
    }
    const response = await api.get('/admin/security/events', { params });
    return response.data;
  },

  getSuspiciousIPs: async () => {
    if (USE_MOCK) {
      return Promise.resolve({
        ips: [],
        total: 0
      });
    }
    const response = await api.get('/admin/security/suspicious-ips');
    return response.data;
  },

  blockIP: async (ip) => {
    if (USE_MOCK) {
      return Promise.resolve({ success: true });
    }
    const response = await api.post('/admin/security/block-ip', { ip });
    return response.data;
  },

  // Performance Monitoring
  getApiPerformance: async (params = {}) => {
    if (USE_MOCK) {
      return Promise.resolve({
        metrics: {
          responseTime: 150,
          errorRate: 0.5,
          requestCount: 1000
        }
      });
    }
    const response = await api.get('/admin/performance/api', { params });
    return response.data;
  },

  getSystemMetrics: async () => {
    if (USE_MOCK) {
      return Promise.resolve({
        cpu: 45,
        memory: 60,
        disk: 55
      });
    }
    const response = await api.get('/admin/performance/system');
    return response.data;
  }
};

export default adminService; 