/**
 * API Service Configuration
 * 
 * This file configures the connection between frontend and backend.
 * 
 * DEVELOPMENT MODE:
 * - Uses mock API (mockApi.ts) with dummy data
 * - No backend required
 * 
 * PRODUCTION MODE:
 * - Set USE_MOCK_API to false
 * - Update BACKEND_URL to your deployed backend
 * - Ensure CORS is configured on backend
 */

// Configuration
export const USE_MOCK_API = false; // Set to true to use mock data
export const BACKEND_URL = 'http://localhost:5000'; // Backend URL

// API endpoints
export const API_ENDPOINTS = {
  health: '/health',
  uploadImage: '/upload-image',
  getResults: '/get-results',
  getBangaloreSummary: '/get-bangalore-summary',
  getRVCEResults: '/get-rvce-results',
  compare: (region: string) => `/compare/${region}`,
};

/**
 * Switch between mock and real API
 * 
 * When USE_MOCK_API is true:
 * - All API calls use mockApi.ts
 * - No backend connection needed
 * - Perfect for frontend development and testing
 * 
 * When USE_MOCK_API is false:
 * - All API calls go to real backend at BACKEND_URL
 * - Backend must be running
 * - Used for integration testing and production
 */
