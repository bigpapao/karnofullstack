import { get, set, del, createStore } from 'idb-keyval';

// Create separate stores for different types of data
const productStore = createStore('karno-cache', 'products');
const categoryStore = createStore('karno-cache', 'categories');
const brandStore = createStore('karno-cache', 'brands');
const userDataStore = createStore('karno-cache', 'user-data');
const settingsStore = createStore('karno-cache', 'settings');
const searchStore = createStore('karno-cache', 'search');

// Default TTL values in milliseconds
const TTL = {
  PRODUCTS: 15 * 60 * 1000, // 15 minutes
  PRODUCT_DETAIL: 30 * 60 * 1000, // 30 minutes
  CATEGORIES: 60 * 60 * 1000, // 1 hour
  BRANDS: 60 * 60 * 1000, // 1 hour
  USER_DATA: 24 * 60 * 60 * 1000, // 24 hours
  SETTINGS: 24 * 60 * 60 * 1000, // 24 hours
  SEARCH: 10 * 60 * 1000, // 10 minutes
};

/**
 * Get a value from cache
 * 
 * @param {string} key - Cache key
 * @param {Object} store - IndexedDB store to use
 * @returns {Promise<Object|null>} - Cached value or null if not found or expired
 */
const getFromCache = async (key, store) => {
  try {
    const cachedData = await get(key, store);
    
    if (!cachedData) return null;
    
    // Check if data is expired
    const { value, expiry } = cachedData;
    if (expiry && expiry < Date.now()) {
      // Data is expired, remove it
      await del(key, store);
      return null;
    }
    
    return value;
  } catch (error) {
    console.error('Error getting from cache:', error);
    return null;
  }
};

/**
 * Set a value in cache
 * 
 * @param {string} key - Cache key
 * @param {Object} value - Value to cache
 * @param {number} ttl - Time to live in milliseconds
 * @param {Object} store - IndexedDB store to use
 * @returns {Promise<void>}
 */
const setInCache = async (key, value, ttl, store) => {
  try {
    // Skip caching if the value is null or undefined
    if (value === null || value === undefined) return;
    
    const cacheEntry = {
      value,
      expiry: Date.now() + ttl,
    };
    
    await set(key, cacheEntry, store);
  } catch (error) {
    console.error('Error setting in cache:', error);
  }
};

/**
 * Clear all cache from a specific store
 * 
 * @param {Object} store - IndexedDB store to clear
 * @returns {Promise<void>}
 */
const clearCache = async (store) => {
  try {
    // Create a new transaction to clear all keys
    const db = store._db;
    const tx = db.transaction(store._storeName, 'readwrite');
    const objectStore = tx.objectStore(store._storeName);
    await objectStore.clear();
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Delete a specific key from cache
 * 
 * @param {string} key - Cache key
 * @param {Object} store - IndexedDB store
 * @returns {Promise<void>}
 */
const deleteFromCache = async (key, store) => {
  try {
    await del(key, store);
  } catch (error) {
    console.error('Error deleting from cache:', error);
  }
};

// Products cache functions
export const getProductFromCache = async (productId) => {
  return getFromCache(`product:${productId}`, productStore);
};

export const setProductInCache = async (productId, product) => {
  return setInCache(`product:${productId}`, product, TTL.PRODUCT_DETAIL, productStore);
};

export const getProductsFromCache = async (queryKey) => {
  return getFromCache(`products:${JSON.stringify(queryKey)}`, productStore);
};

export const setProductsInCache = async (queryKey, products) => {
  return setInCache(`products:${JSON.stringify(queryKey)}`, products, TTL.PRODUCTS, productStore);
};

// Categories cache functions
export const getCategoriesFromCache = async () => {
  return getFromCache('categories', categoryStore);
};

export const setCategoriesInCache = async (categories) => {
  return setInCache('categories', categories, TTL.CATEGORIES, categoryStore);
};

// Brands cache functions
export const getBrandsFromCache = async () => {
  return getFromCache('brands', brandStore);
};

export const setBrandsInCache = async (brands) => {
  return setInCache('brands', brands, TTL.BRANDS, brandStore);
};

// User data cache functions
export const getUserSettingsFromCache = async (userId) => {
  return getFromCache(`user-settings:${userId}`, userDataStore);
};

export const setUserSettingsInCache = async (userId, settings) => {
  return setInCache(`user-settings:${userId}`, settings, TTL.USER_DATA, userDataStore);
};

// Search cache functions
export const getSearchResultsFromCache = async (searchQuery) => {
  return getFromCache(`search:${searchQuery}`, searchStore);
};

export const setSearchResultsInCache = async (searchQuery, results) => {
  return setInCache(`search:${searchQuery}`, results, TTL.SEARCH, searchStore);
};

// Clear functions
export const clearProductCache = async () => {
  return clearCache(productStore);
};

export const clearCategoryCache = async () => {
  return clearCache(categoryStore);
};

export const clearBrandCache = async () => {
  return clearCache(brandStore);
};

export const clearUserCache = async () => {
  return clearCache(userDataStore);
};

export const clearSearchCache = async () => {
  return clearCache(searchStore);
};

export const clearAllCache = async () => {
  await clearProductCache();
  await clearCategoryCache();
  await clearBrandCache();
  await clearUserCache();
  await clearSearchCache();
};

// Delete specific items
export const deleteProductFromCache = async (productId) => {
  return deleteFromCache(`product:${productId}`, productStore);
};

export default {
  getProductFromCache,
  setProductInCache,
  getProductsFromCache,
  setProductsInCache,
  getCategoriesFromCache,
  setCategoriesInCache,
  getBrandsFromCache,
  setBrandsInCache,
  getUserSettingsFromCache,
  setUserSettingsInCache,
  getSearchResultsFromCache,
  setSearchResultsInCache,
  clearProductCache,
  clearCategoryCache,
  clearBrandCache,
  clearUserCache,
  clearSearchCache,
  clearAllCache,
  deleteProductFromCache,
}; 