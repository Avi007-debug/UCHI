/**
 * Centralized CHI Color Mapping and Thresholds
 * 
 * This file ensures consistency across all components
 * for CHI value interpretation and color visualization.
 * 
 * Implements area-aware thresholds and smooth gradient coloring
 * for more accurate representation of vegetation health.
 */

export type CHIStatus = 
  | 'Excellent' 
  | 'Good' 
  | 'Moderate' 
  | 'Poor' 
  | 'Critical';

export type AreaType = 'city' | 'campus' | 'park';

/**
 * Area-Aware CHI Thresholds
 * Different baselines for different area types
 */
export const AREA_THRESHOLDS = {
  city: {
    RED: 0,      // < 20: Critical/Poor
    ORANGE: 20,  // 20-35: Poor/Moderate
    YELLOW: 35,  // > 35: Moderate
  },
  campus: {
    RED: 0,      // < 25: Critical/Poor
    ORANGE: 25,  // 25-40: Poor/Moderate
    YELLOW: 40,  // > 40: Moderate
  },
  park: {
    RED: 0,         // < 30: Poor
    ORANGE: 30,     // 30-36: Moderate
    YELLOW: 36,     // 36-45: Light Green (Good)
    GREEN: 45,      // > 45: Green (Excellent)
  },
} as const;

/**
 * Legacy CHI Thresholds (for backward compatibility)
 */
export const CHI_THRESHOLDS = {
  EXCELLENT: 75,
  GOOD: 60,
  MODERATE: 45,
  POOR: 30,
  CRITICAL: 0,
} as const;

/**
 * CHI Color Mapping
 * Consistent colors for visualization across the app
 */
export const CHI_COLORS = {
  EXCELLENT: '#22c55e', // Green
  GOOD: '#eab308',      // Yellow
  MODERATE: '#f97316',  // Orange
  POOR: '#e67e22',      // Dark Orange
  CRITICAL: '#ef4444',  // Red
} as const;

/**
 * Get CHI status from value
 * @param chi - CHI value (0-100)
 * @returns Status category
 */
export const getCHIStatus = (chi: number): CHIStatus => {
  if (chi >= CHI_THRESHOLDS.EXCELLENT) return 'Excellent';
  if (chi >= CHI_THRESHOLDS.GOOD) return 'Good';
  if (chi >= CHI_THRESHOLDS.MODERATE) return 'Moderate';
  if (chi >= CHI_THRESHOLDS.POOR) return 'Poor';
  return 'Critical';
};

/**
 * Interpolate between two colors
 * @param color1 - Start color in hex
 * @param color2 - End color in hex
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated color in hex
 */
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;
  
  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Get smooth gradient color for CHI value with area-aware thresholds
 * @param chi - CHI value (0-100)
 * @param areaType - Area type (city, campus, park) - optional
 * @returns Hex color code with smooth gradient
 */
export const getCHIColor = (chi: number, areaType?: AreaType): string => {
  // If no area type provided, use legacy global thresholds
  if (!areaType) {
    if (chi >= CHI_THRESHOLDS.EXCELLENT) return CHI_COLORS.EXCELLENT;
    if (chi >= CHI_THRESHOLDS.GOOD) return CHI_COLORS.GOOD;
    if (chi >= CHI_THRESHOLDS.MODERATE) return CHI_COLORS.MODERATE;
    if (chi >= CHI_THRESHOLDS.POOR) return CHI_COLORS.POOR;
    return CHI_COLORS.CRITICAL;
  }

  // Area-aware smooth gradient coloring
  const thresholds = AREA_THRESHOLDS[areaType];
  
  if (areaType === 'city') {
    // City: Red → Orange → Yellow (0-20-35+)
    if (chi < thresholds.ORANGE) {
      // 0-20: Red
      return CHI_COLORS.CRITICAL;
    } else if (chi < thresholds.YELLOW) {
      // 20-35: Red → Orange gradient
      const factor = (chi - thresholds.ORANGE) / (thresholds.YELLOW - thresholds.ORANGE);
      return interpolateColor(CHI_COLORS.POOR, CHI_COLORS.MODERATE, factor);
    } else {
      // 35+: Orange → Yellow gradient
      const factor = Math.min((chi - thresholds.YELLOW) / 30, 1);
      return interpolateColor(CHI_COLORS.MODERATE, CHI_COLORS.GOOD, factor);
    }
  } else if (areaType === 'campus') {
    // Campus: Red → Orange → Yellow (0-25-40+)
    if (chi < thresholds.ORANGE) {
      // 0-25: Red
      return CHI_COLORS.CRITICAL;
    } else if (chi < thresholds.YELLOW) {
      // 25-40: Red → Orange gradient
      const factor = (chi - thresholds.ORANGE) / (thresholds.YELLOW - thresholds.ORANGE);
      return interpolateColor(CHI_COLORS.POOR, CHI_COLORS.MODERATE, factor);
    } else {
      // 40+: Orange → Yellow gradient
      const factor = Math.min((chi - thresholds.YELLOW) / 30, 1);
      return interpolateColor(CHI_COLORS.MODERATE, CHI_COLORS.GOOD, factor);
    }
  } else {
    // Park: Red → Orange → Light Green → Green (0-30-36-45+)
    const parkThresholds = thresholds as typeof AREA_THRESHOLDS.park;
    
    if (chi < parkThresholds.ORANGE) {
      // 0-30: Red
      return CHI_COLORS.CRITICAL;
    } else if (chi < parkThresholds.YELLOW) {
      // 30-36: Orange gradient
      const factor = (chi - parkThresholds.ORANGE) / (parkThresholds.YELLOW - parkThresholds.ORANGE);
      return interpolateColor(CHI_COLORS.MODERATE, CHI_COLORS.GOOD, factor);
    } else if (chi < parkThresholds.GREEN) {
      // 36-45: Light Green gradient (Yellow-Green blend)
      const factor = (chi - parkThresholds.YELLOW) / (parkThresholds.GREEN - parkThresholds.YELLOW);
      return interpolateColor(CHI_COLORS.GOOD, CHI_COLORS.EXCELLENT, factor * 0.6); // 60% blend for light green
    } else {
      // 45+: Green gradient
      const factor = Math.min((chi - parkThresholds.GREEN) / 30, 1);
      return interpolateColor(CHI_COLORS.GOOD, CHI_COLORS.EXCELLENT, 0.6 + (factor * 0.4)); // Full green
    }
  }
};

/**
 * Get interpretation text for status
 * @param status - CHI status
 * @returns Human-readable interpretation
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

/**
 * CHI Legend Data
 * For use in legends and documentation
 */
export const CHI_LEGEND = [
  {
    status: 'Excellent' as CHIStatus,
    color: CHI_COLORS.EXCELLENT,
    range: `≥ ${CHI_THRESHOLDS.EXCELLENT}`,
    description: 'Exceptional vegetation health',
  },
  {
    status: 'Good' as CHIStatus,
    color: CHI_COLORS.GOOD,
    range: `${CHI_THRESHOLDS.GOOD}-${CHI_THRESHOLDS.EXCELLENT - 1}`,
    description: 'Healthy vegetation',
  },
  {
    status: 'Moderate' as CHIStatus,
    color: CHI_COLORS.MODERATE,
    range: `${CHI_THRESHOLDS.MODERATE}-${CHI_THRESHOLDS.GOOD - 1}`,
    description: 'Mixed health signals',
  },
  {
    status: 'Poor' as CHIStatus,
    color: CHI_COLORS.POOR,
    range: `${CHI_THRESHOLDS.POOR}-${CHI_THRESHOLDS.MODERATE - 1}`,
    description: 'Vegetation stress detected',
  },
  {
    status: 'Critical' as CHIStatus,
    color: CHI_COLORS.CRITICAL,
    range: `< ${CHI_THRESHOLDS.POOR}`,
    description: 'Severe degradation',
  },
] as const;
