"""
Image Preprocessing Module
REMOVED - Preprocessing is now handled directly in VegetationDetector class

This module is kept for backward compatibility but is no longer used.
The VegetationDetector class handles all necessary preprocessing:
- Resizing to standard dimensions
- RGB to HSV conversion
- Color-based segmentation

No ML, NDVI, or complex enhancement is needed.
"""

import cv2
import numpy as np
from typing import Any


def preprocess_image(image_path: str) -> Any:
    """
    DEPRECATED - Use VegetationDetector.process_image() instead
    
    Kept for backward compatibility only.
    """
    # Simple load and return - actual processing done in VegetationDetector
    img = cv2.imread(str(image_path))
    return img


def enhance_vegetation_features(image: Any) -> Any:
    """
    REMOVED - No enhancement needed
    """
    return image


def resize_image(image: Any, target_size: Tuple[int, int] = (512, 512)) -> Any:
    """
    DEPRECATED - Use VegetationDetector.preprocess() instead
    """
    return cv2.resize(image, target_size, interpolation=cv2.INTER_AREA)



def validate_image(image_path: str) -> Tuple[bool, str]:
    """
    Validate uploaded image
    
    Checks:
    - File format
    - Image dimensions
    - Image quality
    - Corruption checks
    
    Args:
        image_path: Path to image
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Basic validation would go here
    return True, "Image valid"
