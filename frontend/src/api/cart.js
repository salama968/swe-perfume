import apiClient from './client';

export const fetchCart = async () => {
  const response = await apiClient.get('/api/cart');
  return response.data;
};

export const addCartItem = async (payload) => {
  const response = await apiClient.post('/api/cart/items', payload);
  return response.data;
};

export const updateCartItem = async (productId, payload) => {
  const response = await apiClient.put(`/api/cart/items/${productId}`, payload);
  return response.data;
};

export const removeCartItem = async (productId) => {
  const response = await apiClient.delete(`/api/cart/items/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await apiClient.delete('/api/cart');
  return response.data;
};

export const mergeCartItems = async (payload) => {
  const response = await apiClient.post('/api/cart/merge', payload);
  return response.data;
};
