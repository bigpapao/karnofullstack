/**
 * Address Service
 * 
 * Service for interacting with address API endpoints
 */

import api from './api';

const addressService = {
  /**
   * Get all addresses for the authenticated user
   * @returns {Promise} - Promise containing addresses
   */
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  /**
   * Get a specific address by ID
   * @param {string} id - Address ID
   * @returns {Promise} - Promise containing address
   */
  getAddressById: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  /**
   * Add a new address
   * @param {Object} addressData - Address data
   * @returns {Promise} - Promise containing new address
   */
  addAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  /**
   * Update an existing address
   * @param {string} id - Address ID
   * @param {Object} addressData - Updated address data
   * @returns {Promise} - Promise containing updated address
   */
  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  /**
   * Delete an address
   * @param {string} id - Address ID
   * @returns {Promise} - Promise containing success message
   */
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  /**
   * Set an address as default
   * @param {string} id - Address ID
   * @returns {Promise} - Promise containing updated address
   */
  setDefaultAddress: async (id) => {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data;
  },

  /**
   * Validate an address without saving
   * @param {Object} addressData - Address data to validate
   * @returns {Promise} - Promise containing validation result
   */
  validateAddress: async (addressData) => {
    const response = await api.post('/addresses/validate', addressData);
    return response.data;
  }
};

export default addressService; 