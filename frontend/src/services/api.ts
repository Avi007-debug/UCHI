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

// Log which API is being used
if (import.meta.env.DEV) {
  console.log(`🔌 API Mode: ${USE_MOCK_API ? 'MOCK' : 'REAL'}`);
  console.log(`📍 Backend URL: ${USE_MOCK_API ? 'N/A (using mock data)' : import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}`);
}

// Export the appropriate API based on configuration
export const healthCheck = USE_MOCK_API ? mockApi.healthCheck : realApi.healthCheck;
export const uploadImage = USE_MOCK_API ? mockApi.uploadImage : realApi.uploadImage;
export const getResults = USE_MOCK_API ? mockApi.getResults : realApi.getResults;
export const getBangaloreSummary = USE_MOCK_API ? mockApi.getBangaloreSummary : realApi.getBangaloreSummary;
export const getRVCEResults = USE_MOCK_API ? mockApi.getRVCEResults : realApi.getRVCEResults;
export const getTemporalComparison = USE_MOCK_API ? mockApi.getTemporalComparison : realApi.getTemporalComparison;
export const getCHIStatus = USE_MOCK_API ? mockApi.getCHIStatus : realApi.getCHIStatus;
export const getCHIInterpretation = USE_MOCK_API ? mockApi.getCHIInterpretation : realApi.getCHIInterpretation;
export const getBengaluruCHI = USE_MOCK_API ? mockApi.getBengaluruCHI : realApi.getBengaluruCHI;
export const getRVCECHI = USE_MOCK_API ? mockApi.getRVCECHI : realApi.getRVCECHI;
export const getBangaluruGeometry = USE_MOCK_API ? mockApi.getBangaluruGeometry : realApi.getBangaluruGeometry;
export const getRVCEGeometry = USE_MOCK_API ? mockApi.getRVCEGeometry : realApi.getRVCEGeometry;
