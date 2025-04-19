import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Request interceptor to add authorization header to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manually set the auth token (used by Auth0)
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized or 403 Forbidden responses
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  bulkCreateUsers: (usersData) => api.post('/users/bulk', usersData),
  bulkDeleteUsers: (userIds) => api.delete('/users/bulk', { data: { userIds } })
};

// Collections API
export const collectionsAPI = {
  getCollections: () => api.get('/gallery/collections'),
  getCollection: (id) => api.get(`/gallery/collections/${id}`),
  createCollection: (collectionData) => api.post('/gallery/collections', collectionData),
  updateCollection: (id, collectionData) => api.put(`/gallery/collections/${id}`, collectionData),
  deleteCollection: (id) => api.delete(`/gallery/collections/${id}`),
  updateCollectionAccess: (id, userIds) => api.put(`/gallery/collections/${id}/access`, { userIds })
};

// Gallery API
export const galleryAPI = {
  getImagesInCollection: (collectionId) => api.get(`/gallery/collections/${collectionId}/images`),
  getImage: (id) => api.get(`/gallery/images/${id}`),
  deleteImage: (id) => api.delete(`/gallery/images/${id}`),
  getImageDownloadUrl: (id) => api.get(`/gallery/images/${id}/download`)
};

// Analytics API
export const analyticsAPI = {
  getDashboardAnalytics: () => api.get('/analytics/dashboard'),
  getLoginAnalytics: () => api.get('/analytics/logins'),
  getDownloadAnalytics: () => api.get('/analytics/downloads'),
  getUserAnalytics: (userId) => api.get(`/analytics/users/${userId}`)
};

export default api;