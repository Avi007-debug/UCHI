/**
 * Mock API Service
 * 
 * This file simulates backend API responses with dummy data.
 * In production, replace these with actual API calls to your Flask/FastAPI backend.
 * 
 * Backend Integration Points:
 * - Replace mock functions with fetch/axios calls to your Python backend
 * - Update BASE_URL to point to your backend server
 * - Handle authentication tokens if required
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

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CHI ranges by region (as per requirements)
const CHI_RANGES: Record<string, [number, number]> = {
  'Bengaluru': [55, 70],
  'Campus': [65, 80],
  'Sports Ground': [60, 75],
  'Parking': [40, 55],
  'Roadside': [40, 55],
  'Hostel': [55, 70],
};

// Generate random CHI within range
const generateCHI = (region: string): number => {
  const range = CHI_RANGES[region] || [50, 70];
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
};

// Determine status from CHI value
export const getCHIStatus = (chi: number): CHIStatus => {
  if (chi >= 75) return 'Excellent';
  if (chi >= 60) return 'Good';
  if (chi >= 45) return 'Moderate';
  if (chi >= 30) return 'Poor';
  return 'Critical';
};

// Get interpretation text
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

// In-memory storage for mock data
let mockDatabase: {
  images: ImageMetadata[];
  results: CHIResult[];
} = {
  images: [],
  results: [],
};

// Initialize with some sample data
const initializeMockData = () => {
  const regions: RVCESubRegion[] = ['Campus', 'Sports Ground', 'Parking', 'Hostel', 'Roadside'];
  
  regions.forEach((region, index) => {
    const chi = generateCHI(region);
    const id = `rvce-${index + 1}`;
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    mockDatabase.results.push({
      id,
      imageId: id,
      areaType: 'RVCE',
      subRegion: region,
      chiValue: chi,
      status: getCHIStatus(chi),
      interpretation: getCHIInterpretation(getCHIStatus(chi)),
      date,
      vegetationCoverage: 30 + Math.random() * 50,
      healthyVegetation: 40 + Math.random() * 40,
      stressedVegetation: 10 + Math.random() * 30,
    });
  });

  // Add Bangalore data
  const blrChi = generateCHI('Bengaluru');
  mockDatabase.results.push({
    id: 'blr-1',
    imageId: 'blr-1',
    areaType: 'Bengaluru',
    chiValue: blrChi,
    status: getCHIStatus(blrChi),
    interpretation: getCHIInterpretation(getCHIStatus(blrChi)),
    date: new Date().toISOString().split('T')[0],
    vegetationCoverage: 35 + Math.random() * 30,
    healthyVegetation: 45 + Math.random() * 35,
    stressedVegetation: 15 + Math.random() * 25,
  });
};

initializeMockData();

/**
 * API: Health Check
 * GET /health
 * 
 * Backend placeholder: health_check.py
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  await delay(300);
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: true,
      storage: true,
      aiModule: false, // Will be true when AI integration is complete
    },
  };
};

/**
 * API: Upload Image
 * POST /upload-image
 * 
 * Backend placeholders:
 * - preprocessing.py: Image normalization, resizing, format conversion
 * - vegetation_detection.py: AI-based vegetation segmentation
 * - chi_calculation.py: Calculate CHI from segmented vegetation data
 */
export const uploadImage = async (request: ImageUploadRequest): Promise<CHIResult> => {
  await delay(1500); // Simulate processing time
  
  const id = `img-${Date.now()}`;
  const region = request.subRegion || request.areaType;
  const chi = generateCHI(region);
  const status = getCHIStatus(chi);
  
  // Store metadata
  const metadata: ImageMetadata = {
    id,
    filename: request.file.name,
    areaType: request.areaType,
    subRegion: request.subRegion,
    date: request.date,
    uploadedAt: new Date().toISOString(),
    chiValue: chi,
    status,
  };
  mockDatabase.images.push(metadata);
  
  // Generate result
  const result: CHIResult = {
    id: `result-${id}`,
    imageId: id,
    areaType: request.areaType,
    subRegion: request.subRegion,
    chiValue: chi,
    status,
    interpretation: getCHIInterpretation(status),
    date: request.date,
    vegetationCoverage: 30 + Math.random() * 50,
    healthyVegetation: 40 + Math.random() * 40,
    stressedVegetation: 10 + Math.random() * 30,
  };
  mockDatabase.results.push(result);
  
  return result;
};

/**
 * API: Get All Results
 * GET /get-results
 */
export const getResults = async (): Promise<CHIResult[]> => {
  await delay(500);
  return [...mockDatabase.results];
};

/**
 * API: Get Bangalore Summary
 * GET /get-bangalore-summary
 */
export const getBangaloreSummary = async (): Promise<BangaloreSummary> => {
  await delay(400);
  
  const blrResults = mockDatabase.results.filter(r => r.areaType === 'Bengaluru');
  const avgCHI = blrResults.length > 0 
    ? blrResults.reduce((sum, r) => sum + r.chiValue, 0) / blrResults.length
    : generateCHI('Bengaluru');
  
  return {
    overallCHI: Math.round(avgCHI),
    status: getCHIStatus(avgCHI),
    totalAnalyses: blrResults.length || 1,
    lastUpdated: new Date().toISOString(),
    trendDirection: Math.random() > 0.5 ? 'up' : 'down',
    trendPercentage: Math.round(Math.random() * 5 * 10) / 10,
  };
};

/**
 * API: Get RVCE Results
 * GET /get-rvce-results
 */
export const getRVCEResults = async (): Promise<RVCERegionResult[]> => {
  await delay(400);
  
  const regions: RVCESubRegion[] = ['Campus', 'Sports Ground', 'Parking', 'Hostel', 'Roadside'];
  
  return regions.map(region => {
    const existing = mockDatabase.results.find(r => r.subRegion === region);
    const chi = existing?.chiValue || generateCHI(region);
    
    return {
      region,
      chiValue: chi,
      status: getCHIStatus(chi),
      lastAnalyzed: existing?.date || new Date().toISOString().split('T')[0],
    };
  });
};

/**
 * API: Temporal Comparison
 * GET /compare/{region}
 */
export const getTemporalComparison = async (region: string): Promise<TemporalComparison> => {
  await delay(500);
  
  const oldCHI = generateCHI(region);
  const newCHI = generateCHI(region);
  const change = newCHI - oldCHI;
  
  return {
    region,
    oldCHI,
    oldDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    newCHI,
    newDate: new Date().toISOString().split('T')[0],
    change,
    changePercentage: Math.round((change / oldCHI) * 100 * 10) / 10,
    direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable',
  };
};
