import api from './api';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './mockData';

const USE_MOCK = true; // Toggle this to switch between mock and real API

export const productService = {
  getProducts: async (params = {}) => {
    if (USE_MOCK) {
      return getProducts();
    }
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    if (USE_MOCK) {
      return getProductById(id);
    }
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductBySlug: async (slug) => {
    if (USE_MOCK) {
      const products = await getProducts();
      return Promise.resolve(products.find(p => p.slug === slug) || null);
    }
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  getFeaturedProducts: async (limit = 8) => {
    if (USE_MOCK) {
      const products = await getProducts();
      return Promise.resolve(products.slice(0, limit));
    }
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    if (USE_MOCK) {
      const products = await getProducts();
      return Promise.resolve(products.filter(p => p.category === categoryId));
    }
    const response = await api.get(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  getProductsByBrand: async (brandId, params = {}) => {
    if (USE_MOCK) {
      const products = await getProducts();
      return Promise.resolve(products.filter(p => p.brand === brandId));
    }
    const response = await api.get(`/products/brand/${brandId}`, { params });
    return response.data;
  },

  searchProducts: async (query, params = {}) => {
    if (USE_MOCK) {
      const products = await getProducts();
      return Promise.resolve(
        products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    const response = await api.get('/products/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Admin functions
  createProduct: async (productData) => {
    if (USE_MOCK) {
      return createProduct(productData);
    }
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    if (USE_MOCK) {
      return updateProduct(id, productData);
    }
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    if (USE_MOCK) {
      return deleteProduct(id);
    }
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Reviews
  addReview: async (productId, reviewData) => {
    if (USE_MOCK) {
      const product = await getProductById(productId);
      if (!product) return Promise.reject(new Error('Product not found'));
      
      // In mock mode, we just acknowledge the review
      return Promise.resolve({
        success: true,
        message: 'Review added successfully'
      });
    }
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  }
};

export default productService;
