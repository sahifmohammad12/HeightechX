/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Get the full API URL for an endpoint
 * @param {string} endpoint - API endpoint path (e.g., '/api/health')
 * @returns {string} Full URL
 */
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

/**
 * Default API endpoints
 */
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
};

export default {
  BASE_URL: API_BASE_URL,
  getApiUrl,
  ENDPOINTS: API_ENDPOINTS,
};

