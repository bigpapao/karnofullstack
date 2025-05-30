/**
 * Cart Merging Utilities
 * Handles merging of guest carts with authenticated user carts
 */

import api from '../services/api';
import store from '../store';
import { setCartMerging } from '../store/slices/authSlice';
import { syncWithServer } from '../store/slices/cartSlice';
import { 
  getGuestCartItems, 
  clearGuestSession,
  isGuestSession,
  getSessionId 
} from './sessionUtils';

/**
 * Merge guest cart items with authenticated user's cart
 * Called after successful login or registration
 * 
 * @returns {Promise} Promise that resolves when cart merge is complete
 */
export const mergeGuestCart = async () => {
  try {
    // Dispatch action to indicate cart merging is in progress
    store.dispatch(setCartMerging(true));
    
    // Get guest cart items
    const guestCartItems = getGuestCartItems();
    
    // If no guest cart items, no need to merge
    if (!guestCartItems || guestCartItems.length === 0) {
      store.dispatch(setCartMerging(false));
      return null;
    }
    
    // Call API to merge carts
    const response = await api.post('/api/cart/merge', { 
      guestCart: guestCartItems,
      sessionId: getSessionId() 
    });
    
    // Clear guest cart after successful merge
    clearGuestSession();
    
    // Update the cart in the Redux store with the merged cart
    if (response.data && response.data.data) {
      store.dispatch(syncWithServer(response.data.data));
    }
    
    // Finished merging
    store.dispatch(setCartMerging(false));
    
    return response.data;
  } catch (error) {
    console.error('Error merging carts:', error);
    
    // Ensure cart merging state is reset even if there's an error
    store.dispatch(setCartMerging(false));
    
    throw error;
  }
};

/**
 * Check if there are guest cart items that need to be merged
 * Used to determine if cart merging is needed after authentication
 * 
 * @returns {boolean} True if there are guest cart items to merge
 */
export const hasGuestCartItemsToMerge = () => {
  if (!isGuestSession()) {
    return false;
  }
  
  const guestCartItems = getGuestCartItems();
  return guestCartItems && guestCartItems.length > 0;
};

/**
 * Add a product to the guest cart in local storage
 * 
 * @param {Object} product - The product to add to the cart
 * @param {string} product.productId - The ID of the product
 * @param {number} product.quantity - The quantity to add
 * @param {string} product.name - The name of the product
 * @param {number} product.price - The price of the product
 * @param {string} product.image - The image URL of the product
 * @returns {Array} Updated guest cart items
 */
export const addToGuestCart = (product) => {
  try {
    // Get current guest cart from local storage
    const guestCartItems = JSON.parse(localStorage.getItem('guestCartItems') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = guestCartItems.findIndex(
      item => item.productId === product.productId
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      guestCartItems[existingItemIndex].quantity += product.quantity;
    } else {
      // Add new product to cart
      guestCartItems.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image
      });
    }
    
    // Save updated cart back to local storage
    localStorage.setItem('guestCartItems', JSON.stringify(guestCartItems));
    
    return guestCartItems;
  } catch (error) {
    console.error('Error adding to guest cart:', error);
    return [];
  }
};

/**
 * Get the guest cart from local storage
 * 
 * @returns {Array} Guest cart items
 */
export const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem('guestCartItems') || '[]');
  } catch (error) {
    console.error('Error retrieving guest cart:', error);
    return [];
  }
};

/**
 * Clear the guest cart from local storage
 */
export const clearGuestCart = () => {
  localStorage.removeItem('guestCartItems');
};

// Create an object for default export
const cartMergeUtils = {
  mergeGuestCart,
  hasGuestCartItemsToMerge,
  addToGuestCart,
  getGuestCart,
  clearGuestCart
};

export default cartMergeUtils; 