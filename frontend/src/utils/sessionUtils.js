/**
 * Session Utilities
 * 
 * Functions for managing user sessions, especially for guest users
 * to enable cart persistence and consistent identification.
 */

import { v4 as uuidv4 } from 'uuid';

// Key for storing session ID in localStorage
const SESSION_KEY = 'karno_session_id';

/**
 * Generate a unique session ID
 * @returns {string} Unique session ID
 */
export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

/**
 * Get the current session ID or create a new one if it doesn't exist
 * @returns {string} Session ID
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
};

/**
 * Set the session ID in localStorage
 * @param {string} sessionId - Session ID to store
 */
export const setSessionId = (sessionId) => {
  localStorage.setItem(SESSION_KEY, sessionId);
};

/**
 * Clear the session ID from localStorage
 */
export const clearSessionId = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Check if the current session is a guest session
 * @returns {boolean} True if guest session
 */
export const isGuestSession = () => {
  // If we have a session ID, it could be a guest session
  // Auth status is now determined by HTTP-only cookies, not localStorage
  return !!localStorage.getItem('sessionId');
};

/**
 * Initialize guest user
 * This is used to ensure consistent identification for guest users
 * @returns {Object} Guest user object with session ID
 */
export const initializeGuestUser = () => {
  const sessionId = getSessionId();
  
  return {
    isGuest: true,
    sessionId,
    createdAt: Date.now()
  };
};

/**
 * Track how long a guest session has been active
 * @returns {number} Session age in milliseconds
 */
export const getSessionAge = () => {
  const timestamp = localStorage.getItem('karno_session_created');
  if (!timestamp) return 0;
  
  return Date.now() - parseInt(timestamp);
};

/**
 * Check if guest cart should be preserved after login/logout
 * @returns {boolean} Whether to preserve guest cart
 */
export const shouldPreserveGuestCart = () => {
  // Preserve guest cart if it's less than 30 days old
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  return getSessionAge() < maxAge;
};

/**
 * Clear the guest session data
 */
export const clearGuestSession = () => {
  localStorage.removeItem('sessionId');
  localStorage.removeItem('guestCart');
};

/**
 * Get cart items from guest session storage
 * @returns {Array} Guest cart items
 */
export const getGuestCartItems = () => {
  const cartItems = localStorage.getItem('guestCart');
  return cartItems ? JSON.parse(cartItems) : [];
};

/**
 * Save cart items to guest session storage
 * @param {Array} items - Cart items to save
 */
export const saveGuestCartItems = (items) => {
  localStorage.setItem('guestCart', JSON.stringify(items));
};

/**
 * Mark session as in merging state
 * Used to show loading indicators during cart merging
 */
export const setCartMergingState = (isMerging) => {
  if (isMerging) {
    sessionStorage.setItem('isCartMerging', 'true');
  } else {
    sessionStorage.removeItem('isCartMerging');
  }
};

/**
 * Check if cart is currently being merged
 * @returns {boolean} True if cart is in merging state
 */
export const isCartMerging = () => {
  return sessionStorage.getItem('isCartMerging') === 'true';
};

const sessionUtils = {
  generateSessionId,
  getSessionId,
  setSessionId,
  clearSessionId,
  isGuestSession,
  initializeGuestUser,
  getSessionAge,
  shouldPreserveGuestCart,
  clearGuestSession,
  getGuestCartItems,
  saveGuestCartItems,
  setCartMergingState,
  isCartMerging
};

export default sessionUtils; 