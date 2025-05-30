/**
 * Guest Cart Utilities
 * Handles cart operations for non-authenticated users using localStorage
 */

const CART_STORAGE_KEY = 'cart';

export const guestCartUtils = {
  // Get cart from localStorage
  getCart() {
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error parsing guest cart:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  },

  // Save cart to localStorage
  saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error saving guest cart:', error);
      return false;
    }
  },

  // Add item to guest cart
  addItem(item) {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity || 1;
    } else {
      cart.push({
        productId: item.productId,
        quantity: item.quantity || 1,
        ...item
      });
    }
    
    this.saveCart(cart);
    return cart;
  },

  // Update item quantity in guest cart
  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }
    
    this.saveCart(cart);
    return cart;
  },

  // Remove item from guest cart
  removeItem(productId) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    
    this.saveCart(updatedCart);
    return updatedCart;
  },

  // Clear entire guest cart
  clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  },

  // Get cart item count
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Check if cart has items
  hasItems() {
    const cart = this.getCart();
    return cart.length > 0;
  },

  // Generate session ID for cart tracking
  generateSessionId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  },

  // Get or create session ID
  getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
};