"""
CHI Calculation Module
Real CHI algorithm based on vegetation coverage and greenness intensity
"""

import numpy as np
from typing import Dict


class CHICalculator:
    """Calculate City Health Index from vegetation metrics"""
    
    @staticmethod
    def calculate_chi(vegetation_coverage, greenness_intensity):
        """
        C. Real CHI calculation (0-100)
        
        Formula:
        CHI = (vegetation_coverage * 0.7) + (greenness_intensity * 0.3)
        
        Rationale:
        - Coverage (70%): More important - how much green space exists
        - Intensity (30%): Quality of vegetation - how healthy it is
        
        Args:
            vegetation_coverage: Percentage of area covered by vegetation (0-100)
            greenness_intensity: Average greenness intensity (0-100)
            
        Returns:
            CHI score (0-100)
        """
        chi_score = (vegetation_coverage * 0.7) + (greenness_intensity * 0.3)
        
        # Ensure bounds
        chi_score = np.clip(chi_score, 0, 100)
        
        return float(chi_score)
    
    @staticmethod
    def get_chi_status(chi_score):
        """
        Determine health status from CHI score
        
        Args:
            chi_score: CHI value (0-100)
            
        Returns:
            Status string matching database schema
        """
        if chi_score >= 80:
            return "Excellent"
        elif chi_score >= 70:
            return "Good"
        elif chi_score >= 50:
            return "Moderate"
        elif chi_score >= 30:
            return "Poor"
        else:
            return "Critical"
    
    @staticmethod
    def get_interpretation(status):
        """Get interpretation text for status"""
        interpretations = {
            "Excellent": "Outstanding urban vegetation health with high coverage and quality",
            "Good": "Healthy vegetation cover supporting urban ecosystem services",
            "Moderate": "Adequate vegetation but room for improvement",
            "Poor": "Limited vegetation cover requiring intervention",
            "Critical": "Severe vegetation deficit threatening urban health"
        }
        return interpretations.get(status, "Unknown status")


# Legacy function kept for compatibility
def calculate_chi(image, vegetation_mask, healthy_mask=None, stressed_mask=None) -> Dict[str, float]:
    """
    Legacy function - uses CHICalculator class internally
    Uses simplified calculation from vegetation mask
    """
    calculator = CHICalculator()
    
    # Calculate vegetation coverage from mask
    total_pixels = vegetation_mask.size
    veg_pixels = np.count_nonzero(vegetation_mask)
    vegetation_coverage = (veg_pixels / total_pixels) * 100
    
    # Estimate greenness from mask density (simplified)
    greenness_intensity = min(vegetation_coverage * 1.2, 100)
    
    # Calculate CHI
    chi_value = calculator.calculate_chi(vegetation_coverage, greenness_intensity)
    status = calculator.get_chi_status(chi_value)
    
    return {
        'chi_value': chi_value,
        'status': status,
        'vegetation_coverage': vegetation_coverage,
        'interpretation': calculator.get_interpretation(status)
    }


# REMOVED - Old placeholder logic - not needed anymore

