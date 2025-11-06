import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.120.105.125:8000/api';
// Use 10.0.2.2:8000 for Android emulator or your computer's IP for physical device

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log('API Error:', error.response?.status, error.config?.url, error.message);
    if (error.response?.status === 401) {
      // Clear stored auth data on 401 errors
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // The auth context will handle navigation back to login
    }
    return Promise.reject(error);
  }
);

// User Management API functions
export const userAPI = {
  // Get all users (superuser only)
  getUsers: () => api.get('/admin/users/'),
  
  // Create new user (superuser only)
  createUser: (userData) => api.post('/admin/users/', userData),
  
  // Update user (superuser only)
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}/`, userData),
  
  // Delete user (superuser only)
  deleteUser: (userId) => api.delete(`/admin/users/${userId}/`),
  
  // Get user details
  getUserDetails: (userId) => api.get(`/admin/users/${userId}/`),
};

export default api;