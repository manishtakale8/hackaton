import api from './axios';

export const getBookmarks = () => api.get('/api/bookmarks');
export const addBookmark = (opportunityId) =>
  api.post(`/api/bookmarks/${opportunityId}`);
export const removeBookmark = (opportunityId) =>
  api.delete(`/api/bookmarks/${opportunityId}`);
