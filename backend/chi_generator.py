"""
CHI Generator Module
Generates dummy CHI values based on region-specific ranges

This module will be replaced with actual AI-based CHI calculation
once image processing and vegetation detection modules are integrated.
"""

import random
from config import Config


class CHIGenerator:
    """Generate dummy CHI values for testing"""
    
    def __init__(self):
        self.ranges = Config.CHI_RANGES
        self.thresholds = Config.STATUS_THRESHOLDS
    
    def generate_chi(self, region: str) -> float:
        """
        Generate CHI value within region-specific range
        
        Args:
            region: Region name (Bengaluru, Campus, Sports Ground, etc.)
            
        Returns:
            CHI value as float
        """
        if region in self.ranges:
            min_chi, max_chi = self.ranges[region]
        else:
            # Default range
            min_chi, max_chi = 50, 70
        
        # Generate random value within range
        chi = random.uniform(min_chi, max_chi)
        return round(chi, 2)
    
    def get_status(self, chi: float) -> str:
        """
        Determine health status from CHI value
        
        Args:
            chi: CHI value
            
        Returns:
            Status string (Excellent, Good, Moderate, Poor, Critical)
        """
        if chi >= self.thresholds['Excellent']:
            return 'Excellent'
        elif chi >= self.thresholds['Good']:
            return 'Good'
        elif chi >= self.thresholds['Moderate']:
            return 'Moderate'
        elif chi >= self.thresholds['Poor']:
            return 'Poor'
        else:
            return 'Critical'
    
    def get_interpretation(self, status: str) -> str:
        """
        Get interpretation text for status
        
        Args:
            status: Health status
            
        Returns:
            Interpretation text
        """
        interpretations = {
            'Excellent': (
                'The vegetation in this area shows exceptional health with robust canopy coverage. '
                'Photosynthetic activity is optimal, indicating well-maintained green spaces with '
                'adequate water and nutrient availability.'
            ),
            'Good': (
                'The vegetation displays healthy characteristics with good canopy density. '
                'Minor stress indicators may be present but overall ecosystem function is maintained.'
            ),
            'Moderate': (
                'The vegetation shows mixed health signals. Some areas display stress patterns that '
                'may indicate water scarcity, nutrient deficiency, or early-stage disease.'
            ),
            'Poor': (
                'Significant vegetation stress detected. Canopy coverage is sparse with visible '
                'decline in plant health. Immediate intervention may be required.'
            ),
            'Critical': (
                'Severe vegetation degradation observed. Urgent attention needed to prevent further '
                'ecosystem decline. Consider reforestation or intensive care programs.'
            )
        }
        
        return interpretations.get(status, 'Unknown status')
