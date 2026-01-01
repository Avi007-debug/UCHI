/**
 * API Service - Main Entry Point
 * 
 * This file automatically switches between mock and real API
 * based on the configuration in apiConfig.ts
 * 
 * Usage:
 * import { uploadImage, getResults } from '@/services/api';
 */

import { USE_MOCK_API } from './apiConfig';

// Import both APIs
import * as mockApi from './mockApi';
import * as realApi from './realApi';

// Export the appropriate API based on configuration
const api = USE_MOCK_API ? mockApi : realApi;

export const {
  healthCheck,
  uploadImage,
  getResults,
  getBangaloreSummary,
  getRVCEResults,
  getTemporalComparison,
  getCHIStatus,
  getCHIInterpretation,
} = api;

// Log which API is being used
if (import.meta.env.DEV) {
  console.log(`🔌 API Mode: ${USE_MOCK_API ? 'MOCK' : 'REAL'}`);
  console.log(`📍 Backend URL: ${USE_MOCK_API ? 'N/A (using mock data)' : import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}`);
}
