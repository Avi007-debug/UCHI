/**
 * Centralized CHI Color Mapping and Thresholds
 * 
 * This file ensures consistency across all components
 * for CHI value interpretation and color visualization.
 */

export type CHIStatus = 
  | 'Excellent' 
  | 'Good' 
  | 'Moderate' 
  | 'Poor' 
  | 'Critical';

/**
 * CHI Thresholds
 * Must match backend STATUS_THRESHOLDS in config.py
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
 * Get color for CHI value
 * @param chi - CHI value (0-100)
 * @returns Hex color code
 */
export const getCHIColor = (chi: number): string => {
  if (chi >= CHI_THRESHOLDS.EXCELLENT) return CHI_COLORS.EXCELLENT;
  if (chi >= CHI_THRESHOLDS.GOOD) return CHI_COLORS.GOOD;
  if (chi >= CHI_THRESHOLDS.MODERATE) return CHI_COLORS.MODERATE;
  if (chi >= CHI_THRESHOLDS.POOR) return CHI_COLORS.POOR;
  return CHI_COLORS.CRITICAL;
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
