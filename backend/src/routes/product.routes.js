/**
 * Enhanced Product Routes (ACTIVE ROUTES)
 * 
 * IMPORTANT: This is the current active product routes file used in the application.
 * The original product.routes.js file has been removed.
 * 
 * This file defines all routes related to products, including enhanced search functionality.
 */

import express from 'express';
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByBrand,
  searchProducts,
  getFeaturedProducts,
  clearProductCache,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import {
  getProductAnalytics,
  updateProductStock,
  bulkUpdateProductStock,
} from '../controllers/product-analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateRequest, schemas } from '../middleware/validation.middleware.js';
import { uploadProductImages } from '../utils/fileUpload.js';
import { cacheMiddleware, clearCache } from '../middleware/cache.middleware.js';
import { trackEvent } from '../middleware/event-tracking.middleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { getSearchSuggestions, searchByVehicle, getVehicleMakes, getVehicleModels, getVehicleYears } from '../controllers/product.controller.enhanced.js';
import { CACHE_KEYS } from '../config/redis.js';
import { paginationMiddleware } from '../middleware/pagination.middleware.js';

const router = express.Router();

// Public routes with caching and pagination
router.get('/', 
  paginationMiddleware,
  validateRequest(schemas.search),
  cacheMiddleware(CACHE_KEYS.PRODUCTS),
  asyncHandler(getProducts)
);

router.get('/featured', 
  paginationMiddleware,
  asyncHandler(getFeaturedProducts)
);

router.get('/search', 
  paginationMiddleware,
  validateRequest(schemas.search, 'query'), 
  asyncHandler(searchProducts)
);

router.get('/:id',
  validateRequest(schemas.id),
  cacheMiddleware(CACHE_KEYS.PRODUCT),
  asyncHandler(getProductById)
);

router.get('/category/:categoryId',
  paginationMiddleware,
  validateRequest(schemas.category),
  cacheMiddleware(CACHE_KEYS.PRODUCTS),
  asyncHandler(getProductsByCategory)
);

router.get('/brand/:brandId', 
  paginationMiddleware,
  asyncHandler(getProductsByBrand)
);

// Enhanced search endpoints
router.get('/suggest', getSearchSuggestions);
router.get('/vehicle-search', searchByVehicle);

// Vehicle compatibility endpoints
router.get('/vehicle-makes', cacheMiddleware(86400), getVehicleMakes); // Cache for 1 day
router.get('/vehicle-models', cacheMiddleware(86400), getVehicleModels);
router.get('/vehicle-years', cacheMiddleware(86400), getVehicleYears);

// Protected routes (admin only)
router.use(authenticate, authorize('admin'));

// Product management
router.post('/',
  verifyToken,
  isAdmin,
  validateRequest(schemas.createProduct),
  clearCache(CACHE_KEYS.PRODUCTS),
  asyncHandler(createProduct)
);

router.put('/:id',
  verifyToken,
  isAdmin,
  validateRequest(schemas.id),
  validateRequest(schemas.updateProduct),
  clearCache(CACHE_KEYS.PRODUCTS),
  clearCache(CACHE_KEYS.PRODUCT),
  asyncHandler(updateProduct)
);

router.delete('/:id',
  verifyToken,
  isAdmin,
  validateRequest(schemas.id),
  clearCache(CACHE_KEYS.PRODUCTS),
  clearCache(CACHE_KEYS.PRODUCT),
  asyncHandler(deleteProduct)
);

// Product analytics and inventory management
router.get('/analytics/stats', getProductAnalytics);
router.put('/bulk-stock-update', bulkUpdateProductStock);
router.put('/:id/stock', updateProductStock);

export default router; 