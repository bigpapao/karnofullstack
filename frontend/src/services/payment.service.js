import api from './api';

export const paymentService = {
  createPaymentIntent: async (orderId) => {
    const response = await api.post('/payments/create-payment-intent', { orderId });
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  }
};

export default paymentService;
