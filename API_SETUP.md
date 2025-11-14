# API Setup Guide

This document explains how the frontend connects to the backend API.

## Architecture

- **Frontend**: React application running on localhost
- **Backend**: Express server running on localhost
- **Connection**: Frontend uses environment variables to connect to backend URL

## Configuration Files

### Frontend API Configuration

- **`src/config/api.js`**: Centralized API configuration
  - Reads `VITE_API_BASE_URL` from environment variables
  - Provides `getApiUrl()` helper function
  - Defaults to `http://localhost:3001` for local development

- **`src/utils/api.js`**: API utility functions
  - Uses axios for HTTP requests
  - Includes request/response interceptors
  - Handles authentication tokens
  - Provides error handling with toast notifications

### Backend Configuration

- **`server/server.js`**: Express server with CORS configuration
  - Reads `ALLOWED_ORIGINS` from environment variables
  - Allows requests from localhost for development
  - Supports multiple origins (comma-separated)

## Usage Example

```javascript
import { api } from '../utils/api';

// Health check
const checkHealth = async () => {
  try {
    const response = await api.healthCheck();
    console.log('Backend is healthy:', response);
  } catch (error) {
    console.error('Backend health check failed:', error);
  }
};
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
```

### Backend (.env)
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
PORT=3001
NODE_ENV=development
```

## Adding New API Endpoints

1. Add endpoint to `src/config/api.js`:
```javascript
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  NEW_ENDPOINT: '/api/new-endpoint', // Add here
};
```

2. Add function to `src/utils/api.js`:
```javascript
export const api = {
  healthCheck: async () => {
    const response = await apiClient.get(getApiUrl('/api/health'));
    return response.data;
  },
  newEndpoint: async (data) => {
    const response = await apiClient.post(getApiUrl('/api/new-endpoint'), data);
    return response.data;
  },
};
```

3. Use in your component:
```javascript
import { api } from '../utils/api';

const handleAction = async () => {
  const result = await api.newEndpoint({ data: 'value' });
};
```

## Testing Locally

1. Start backend:
```bash
cd server
npm install
npm start
```

2. Start frontend:
```bash
npm install
npm run dev
```

3. Verify connection:
   - Frontend should connect to `http://localhost:3001`
   - Check browser console for any CORS errors
   - Test API calls in Network tab
   - Backend health check should return status: 'ok'

