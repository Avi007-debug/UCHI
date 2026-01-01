/**
 * Real API Service
 * 
 * This file implements actual HTTP calls to the Python Flask backend.
 * Use this when USE_MOCK_API is set to false in apiConfig.ts
 * 
 * Backend Integration:
 * - All functions map directly to Flask API endpoints
 * - Uses fetch API for HTTP requests
 * - Handles errors and returns typed responses
 */

import type {
  AreaType,
  RVCESubRegion,
  CHIStatus,
  ImageMetadata,
  CHIResult,
  BangaloreSummary,
  RVCERegionResult,
  TemporalComparison,
  HealthCheckResponse,
  ImageUploadRequest,
} from '@/types/uchi';
import { BACKEND_URL, API_ENDPOINTS } from './apiConfig';

/**
 * Health Check
 * GET /health
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.health}`);
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
};

/**
 * Upload Image
 * POST /upload-image
 */
export const uploadImage = async (request: ImageUploadRequest): Promise<CHIResult> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('area_type', request.areaType);
  if (request.subRegion) {
    formData.append('sub_region', request.subRegion);
  }
  formData.append('date', request.date);

  const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.uploadImage}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
};

/**
 * Get All Results
 * GET /get-results
 */
export const getResults = async (): Promise<CHIResult[]> => {
  const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.getResults}`);
  if (!response.ok) throw new Error('Failed to fetch results');
  return response.json();
};

/**
 * Get Bangalore Summary
 * GET /get-bangalore-summary
 */
export const getBangaloreSummary = async (): Promise<BangaloreSummary> => {
  const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.getBangaloreSummary}`);
  if (!response.ok) throw new Error('Failed to fetch Bangalore summary');
  return response.json();
};

/**
 * Get RVCE Results
 * GET /get-rvce-results
 */
export const getRVCEResults = async (): Promise<RVCERegionResult[]> => {
  const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.getRVCEResults}`);
  if (!response.ok) throw new Error('Failed to fetch RVCE results');
  return response.json();
};

/**
 * Temporal Comparison
 * GET /compare/{region}
 */
export const getTemporalComparison = async (region: string): Promise<TemporalComparison> => {
  const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.compare(region)}`);
  if (!response.ok) throw new Error('Failed to fetch comparison');
  return response.json();
};

/**
 * Helper: Get CHI Status from value
 */
export const getCHIStatus = (chi: number): CHIStatus => {
  if (chi >= 75) return 'Excellent';
  if (chi >= 60) return 'Good';
  if (chi >= 45) return 'Moderate';
  if (chi >= 30) return 'Poor';
  return 'Critical';
};

/**
 * Helper: Get interpretation text
 */
export const getCHIInterpretation = (status: CHIStatus): string => {
  const interpretations: Record<CHIStatus, string> = {
    'Excellent': 'The vegetation in this area shows exceptional health with robust canopy coverage. Photosynthetic activity is optimal, indicating well-maintained green spaces with adequate water and nutrient availability.',
    'Good': 'The vegetation displays healthy characteristics with good canopy density. Minor stress indicators may be present but overall ecosystem function is maintained.',
    'Moderate': 'The vegetation shows mixed health signals. Some areas display stress patterns that may indicate water scarcity, nutrient deficiency, or early-stage disease.',
    'Poor': 'Significant vegetation stress detected. Canopy coverage is sparse with visible decline in plant health. Immediate intervention may be required.',
    'Critical': 'Severe vegetation degradation observed. Urgent attention needed to prevent further ecosystem decline. Consider reforestation or intensive care programs.',
  };
  return interpretations[status];
};
