/**
 * API Utility Functions
 * Centralized API call functions using axios
 */
import axios from 'axios';
import { getApiUrl } from '../config/api';
import toast from 'react-hot-toast';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error('Unauthorized. Please log in again.');
          break;
        case 403:
          toast.error('Access forbidden.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data?.message || 'An error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

/**
 * API call functions
 */
export const api = {
  /**
   * Health check endpoint
   */
  healthCheck: async () => {
    const response = await apiClient.get(getApiUrl('/api/health'));
    return response.data;
  },
};

export default api;

