import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';
import { AppError } from '../middleware/error-handler.middleware.js';
import { logger } from '../utils/logger.js';
import redis from '../utils/redis.js';

// Cache TTL values (in seconds)
const CACHE_TTL = {
  PRODUCTS_LIST: 600,        // 10 minutes
  PRODUCT_DETAIL: 3600,      // 1 hour
  FEATURED_PRODUCTS: 1800,   // 30 minutes
  SEARCH_RESULTS: 300,       // 5 minutes
  CATEGORY_PRODUCTS: 900,    // 15 minutes
  BRAND_PRODUCTS: 900        // 15 minutes
};

/**
 * Get all products with filtering, sorting, and pagination
 */
export const getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      brand,
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      featured,
      inStock
    } = req.query;
    
    // Build cache key from query parameters
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    
    // Try to get data from cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }
    
    // Build query filters
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (brand) {
      query.brand = brand;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'specs.value': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice !== undefined) {
      query.price = { ...(query.price || {}), $gte: Number(minPrice) };
    }
    
    if (maxPrice !== undefined) {
      query.price = { ...(query.price || {}), $lte: Number(maxPrice) };
    }
    
    if (featured) {
      query.featured = featured === 'true';
    }
    
    if (inStock) {
      query.inStock = inStock === 'true';
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Prepare sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .lean();
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    const result = {
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
    
    // Save to cache
    const cacheTTL = featured ? CACHE_TTL.FEATURED_PRODUCTS : CACHE_TTL.PRODUCTS_LIST;
    await redis.set(cacheKey, JSON.stringify(result), 'EX', cacheTTL);
    
    res.json(result);
  } catch (error) {
    logger.error({
      message: 'Error fetching products',
      error: error.message,
      stack: error.stack
    });
    next(new AppError('Error fetching products', 500));
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Try to get from cache
    const cacheKey = `product:${id}`;
    const cachedProduct = await redis.get(cacheKey);
    
    if (cachedProduct) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedProduct));
    }
    
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .populate('relatedProducts', 'name slug images price discount inStock')
      .lean();
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    // Track product view (non-blocking)
    Product.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
    
    // Save to cache
    await redis.set(cacheKey, JSON.stringify(product), 'EX', CACHE_TTL.PRODUCT_DETAIL);
    
    res.json(product);
  } catch (error) {
    logger.error({
      message: 'Error fetching product by ID',
      error: error.message,
      stack: error.stack,
      params: req.params
    });
    next(new AppError('Error fetching product', 500));
  }
};

/**
 * Get all products for a specific category
 */
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Try to get from cache
    const cacheKey = `category:${categoryId}:products:${page}:${limit}`;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }
    
    // Make sure category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Find products in this category
    const products = await Product.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('brand', 'name slug logo')
      .lean();
    
    // Get total for pagination
    const total = await Product.countDocuments({ category: categoryId });
    
    const result = {
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
    
    // Save to cache
    await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL.CATEGORY_PRODUCTS);
    
    res.json(result);
  } catch (error) {
    logger.error({
      message: 'Error fetching products by category',
      error: error.message,
      stack: error.stack,
      params: req.params
    });
    next(new AppError('Error fetching products by category', 500));
  }
};

/**
 * Get all products for a specific brand
 */
export const getProductsByBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Try to get from cache
    const cacheKey = `brand:${brandId}:products:${page}:${limit}`;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }
    
    // Make sure brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return next(new AppError('Brand not found', 404));
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Find products of this brand
    const products = await Product.find({ brand: brandId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug')
      .lean();
    
    // Get total for pagination
    const total = await Product.countDocuments({ brand: brandId });
    
    const result = {
      brand: {
        _id: brand._id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description
      },
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
    
    // Save to cache
    await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL.BRAND_PRODUCTS);
    
    res.json(result);
  } catch (error) {
    logger.error({
      message: 'Error fetching products by brand',
      error: error.message,
      stack: error.stack,
      params: req.params
    });
    next(new AppError('Error fetching products by brand', 500));
  }
};

/**
 * Search products
 */
export const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return next(new AppError('Search query too short', 400));
    }
    
    // Try to get from cache
    const cacheKey = `search:${q}:${page}:${limit}`;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Search query
    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'specs.value': { $regex: q, $options: 'i' } }
      ]
    };
    
    // Execute search
    const products = await Product.find(searchQuery)
      .sort({ featured: -1, score: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .lean();
    
    // Get total for pagination
    const total = await Product.countDocuments(searchQuery);
    
    const result = {
      query: q,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
    
    // Save to cache
    await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL.SEARCH_RESULTS);
    
    res.json(result);
  } catch (error) {
    logger.error({
      message: 'Error searching products',
      error: error.message,
      stack: error.stack,
      query: req.query
    });
    next(new AppError('Error searching products', 500));
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;
    
    // Try to get from cache
    const cacheKey = `featured:products:${limit}`;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }
    
    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .lean();
    
    // Save to cache
    await redis.set(cacheKey, JSON.stringify(products), 'EX', CACHE_TTL.FEATURED_PRODUCTS);
    
    res.json(products);
  } catch (error) {
    logger.error({
      message: 'Error fetching featured products',
      error: error.message,
      stack: error.stack
    });
    next(new AppError('Error fetching featured products', 500));
  }
};

/**
 * Clear product cache after admin update
 */
export const clearProductCache = async (productId) => {
  try {
    // Clear specific product cache
    await redis.del(`product:${productId}`);
    
    // Clear lists that might contain this product
    const keys = await redis.keys('products:*');
    const categoryKeys = await redis.keys('category:*:products:*');
    const brandKeys = await redis.keys('brand:*:products:*');
    const featuredKeys = await redis.keys('featured:products:*');
    const searchKeys = await redis.keys('search:*');
    
    const allKeys = [
      ...keys,
      ...categoryKeys,
      ...brandKeys,
      ...featuredKeys,
      ...searchKeys
    ];
    
    if (allKeys.length > 0) {
      await redis.del(allKeys);
    }
    
    logger.debug(`Cleared cache for product ${productId}`);
  } catch (error) {
    logger.error({
      message: 'Error clearing product cache',
      error: error.message,
      productId
    });
  }
};

/**
 * Create a new product
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    // Optionally clear cache
    await clearProductCache(product._id);
    res.status(201).json({ success: true, product });
  } catch (error) {
    logger.error({
      message: 'Error creating product',
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    next(new AppError('Error creating product', 500));
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    // Optionally clear cache
    await clearProductCache(id);
    res.json({ success: true, product });
  } catch (error) {
    logger.error({
      message: 'Error updating product',
      error: error.message,
      stack: error.stack,
      params: req.params,
      body: req.body
    });
    next(new AppError('Error updating product', 500));
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    // Optionally clear cache
    await clearProductCache(id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    logger.error({
      message: 'Error deleting product',
      error: error.message,
      stack: error.stack,
      params: req.params
    });
    next(new AppError('Error deleting product', 500));
  }
};

export default {
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
}; 