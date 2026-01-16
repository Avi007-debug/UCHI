"""
Real Computer Vision Pipeline for CHI Calculation
Minimal, rule-based vegetation detection from RGB images
"""

import cv2
import numpy as np
from typing import Dict, Tuple


class VegetationDetector:
    """Rule-based vegetation detection using HSV color space"""
    
    def __init__(self):
        # HSV color range for green vegetation
        # Adjusted thresholds for better detection including yellowish vegetation
        # H: 25-95 (green to yellow-green hues)
        # S: 30-255 (lower saturation to catch lighter greens)
        # V: 30-255 (lower value to catch shadowed vegetation)
        self.lower_green = np.array([25, 30, 30])
        self.upper_green = np.array([95, 255, 255])
    
    def preprocess(self, image, target_size=(512, 512)):
        """
        A. Minimal preprocessing
        - Resize image
        - Convert RGB to HSV
        """
        # Resize to standard size
        resized = cv2.resize(image, target_size, interpolation=cv2.INTER_AREA)
        
        # Convert to HSV color space
        hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)
        
        return resized, hsv
    
    def detect_vegetation(self, hsv_image):
        """
        B. Vegetation detection (CORE)
        - Generate vegetation mask using HSV color range
        - Count vegetation vs total pixels
        """
        # Create binary mask for green vegetation
        vegetation_mask = cv2.inRange(hsv_image, self.lower_green, self.upper_green)
        
        # Count pixels
        total_pixels = vegetation_mask.size
        vegetation_pixels = np.count_nonzero(vegetation_mask)
        
        # Calculate coverage percentage
        vegetation_coverage = (vegetation_pixels / total_pixels) * 100
        
        return vegetation_mask, vegetation_pixels, total_pixels, vegetation_coverage
    
    def calculate_greenness_intensity(self, hsv_image, vegetation_mask):
        """
        Calculate average greenness intensity from vegetation areas
        Uses saturation and value channels as proxy for vegetation health
        """
        # Extract S and V channels
        saturation = hsv_image[:, :, 1]
        value = hsv_image[:, :, 2]
        
        # Get vegetation pixels only
        veg_saturation = saturation[vegetation_mask > 0]
        veg_value = value[vegetation_mask > 0]
        
        if len(veg_saturation) == 0:
            return 0.0
        
        # Average saturation and value (normalized to 0-100)
        avg_saturation = np.mean(veg_saturation) / 255 * 100
        avg_value = np.mean(veg_value) / 255 * 100
        
        # Greenness intensity: weighted combination
        greenness_intensity = (avg_saturation * 0.6 + avg_value * 0.4)
        
        return greenness_intensity
    
    def process_image(self, image_path):
        """
        Process single image and return metrics
        """
        # Read image
        image = cv2.imread(str(image_path))
        if image is None:
            raise ValueError(f"Could not read image: {image_path}")
        
        # Preprocess
        resized, hsv = self.preprocess(image)
        
        # Detect vegetation
        veg_mask, veg_pixels, total_pixels, veg_coverage = self.detect_vegetation(hsv)
        
        # Calculate greenness
        greenness = self.calculate_greenness_intensity(hsv, veg_mask)
        
        return {
            'vegetation_coverage': veg_coverage,
            'greenness_intensity': greenness,
            'vegetation_pixels': veg_pixels,
            'total_pixels': total_pixels
        }




# Legacy function kept for compatibility
def detect_vegetation(image) -> Tuple[np.ndarray, Dict[str, float]]:
    """
    Legacy function - uses VegetationDetector class internally
    """
    detector = VegetationDetector()
    
    # Create dummy image path for in-memory processing
    temp_mask = np.zeros((image.shape[0], image.shape[1]), dtype=np.uint8)
    
    # Convert to HSV and detect
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    veg_mask, _, _, veg_coverage = detector.detect_vegetation(hsv)
    greenness = detector.calculate_greenness_intensity(hsv, veg_mask)
    
    metrics = {
        'vegetation_coverage': veg_coverage,
        'greenness_intensity': greenness
    }
    
    return veg_mask, metrics

    """
    Calculate vegetation coverage metrics
    
    Args:
        mask: Total vegetation mask
        healthy_mask: Healthy vegetation mask
        stressed_mask: Stressed vegetation mask
        
    Returns:
        Dictionary with metrics
    """
    # If numpy is unavailable, compute simple counts using Python
    if np is None:
        print('[VEGETATION DETECTION] NumPy not available — computing simple metrics')
        total_pixels = len(mask) * len(mask[0]) if mask and mask[0] else 1
        veg_pixels = sum(sum(1 for v in row if v) for row in mask)
        healthy_pixels = sum(sum(1 for v in row if v) for row in healthy_mask)
        stressed_pixels = sum(sum(1 for v in row if v) for row in stressed_mask)

        metrics = {
            'total_coverage': (veg_pixels / total_pixels) * 100,
            'healthy_percentage': (healthy_pixels / (veg_pixels + 1e-6)) * 100,
            'stressed_percentage': (stressed_pixels / (veg_pixels + 1e-6)) * 100,
            'vegetation_pixels': int(veg_pixels),
            'healthy_pixels': int(healthy_pixels),
            'stressed_pixels': int(stressed_pixels)
        }

        return metrics

    total_pixels = mask.size
    veg_pixels = np.sum(mask)
    healthy_pixels = np.sum(healthy_mask)
    stressed_pixels = np.sum(stressed_mask)

    metrics = {
        'total_coverage': (veg_pixels / total_pixels) * 100,
        'healthy_percentage': (healthy_pixels / (veg_pixels + 1e-6)) * 100,
        'stressed_percentage': (stressed_pixels / (veg_pixels + 1e-6)) * 100,
        'vegetation_pixels': int(veg_pixels),
        'healthy_pixels': int(healthy_pixels),
        'stressed_pixels': int(stressed_pixels)
    }

    return metrics


# REMOVED - Not using ML model loading
def load_vegetation_model(model_path: str = None):
    """REMOVED - Not using ML models"""
    pass

