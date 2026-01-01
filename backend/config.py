"""
Configuration file for UCHI Backend
"""

import os


class Config:
    """Application configuration"""
    
    # Server settings
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = True
    
    # Database settings
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'uchi.db')
    
    # File upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MAX_FILE_SIZE = 16 * 1024 * 1024  # 16 MB
    
    # CHI ranges by region (as per requirements)
    CHI_RANGES = {
        'Bengaluru': (55, 70),
        'Campus': (65, 80),
        'Sports Ground': (60, 75),
        'Parking': (40, 55),
        'Roadside': (40, 55),
        'Hostel': (55, 70),
    }
    
    # Status thresholds
    STATUS_THRESHOLDS = {
        'Excellent': 75,
        'Good': 60,
        'Moderate': 45,
        'Poor': 30,
        'Critical': 0
    }
