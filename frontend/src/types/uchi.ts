// Type definitions for Urban Canopy Health Index application

export type AreaType = 'Bengaluru' | 'RVCE';

export type RVCESubRegion = 
  | 'Campus' 
  | 'Sports Ground' 
  | 'Parking' 
  | 'Hostel' 
  | 'Roadside';

export type CHIStatus = 
  | 'Excellent' 
  | 'Good' 
  | 'Moderate' 
  | 'Poor' 
  | 'Critical';

export interface ImageUploadRequest {
  file: File;
  areaType: AreaType;
  subRegion?: RVCESubRegion;
  date: string;
}

export interface ImageMetadata {
  id: string;
  filename: string;
  areaType: AreaType;
  subRegion?: RVCESubRegion;
  date: string;
  uploadedAt: string;
  chiValue?: number;
  status?: CHIStatus;
}

export interface CHIResult {
  id: string;
  imageId: string;
  areaType: AreaType;
  subRegion?: RVCESubRegion;
  chiValue: number;
  status: CHIStatus;
  interpretation: string;
  date: string;
  vegetationCoverage: number;
  healthyVegetation: number;
  stressedVegetation: number;
}

export interface BangaloreSummary {
  overallCHI: number;
  status: CHIStatus;
  totalAnalyses: number;
  lastUpdated: string;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface RVCERegionResult {
  region: RVCESubRegion;
  chiValue: number;
  status: CHIStatus;
  lastAnalyzed: string;
}

export interface TemporalComparison {
  region: string;
  oldCHI: number;
  oldDate: string;
  newCHI: number;
  newDate: string;
  change: number;
  changePercentage: number;
  direction: 'increase' | 'decrease' | 'stable';
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: boolean;
    storage: boolean;
    aiModule: boolean;
  };
}
