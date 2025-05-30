import api from './api';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from './mockData';

const USE_MOCK = true; // Toggle between mock and real API

export const categoryService = {
  getCategories: async (params = {}) => {
    if (USE_MOCK) {
      return getCategories();
    }
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id) => {
    if (USE_MOCK) {
      return getCategoryById(id);
    }
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getFeaturedCategories: async (limit = 6) => {
    if (USE_MOCK) {
      const categories = await getCategories();
      // Filter active categories and return the requested limit
      return categories
        .filter(cat => cat.status === 'active')
        .slice(0, limit);
    }
    const response = await api.get('/categories/featured', { params: { limit } });
    return response.data;
  },

  // Admin functions
  createCategory: async (categoryData) => {
    if (USE_MOCK) {
      return createCategory(categoryData);
    }
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    if (USE_MOCK) {
      return updateCategory(id, categoryData);
    }
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    if (USE_MOCK) {
      return deleteCategory(id);
    }
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;
