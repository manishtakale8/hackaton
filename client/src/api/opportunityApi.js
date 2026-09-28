import api from './axios';

export const getOpportunities = (params) =>
  api.get('/api/opportunities', { params });

export const getOpportunityById = (id) => api.get(`/api/opportunities/${id}`);

export const createOpportunity = (data) => api.post('/api/opportunities', data);
export const updateOpportunity = (id, data) =>
  api.put(`/api/opportunities/${id}`, data);
export const deleteOpportunity = (id) =>
  api.delete(`/api/opportunities/${id}`);

export const getRecommendations = () => api.get('/api/recommendations');
