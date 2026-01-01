"""
Configuration file for UCHI Backend
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration"""
    
    # Server settings
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = True
    
    # Supabase settings (MUST be set in .env file)
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'YOUR_SUPABASE_URL')
    
    # Backend uses SERVICE_KEY (full privileges) - keep this SECRET!
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', os.getenv('SUPABASE_KEY', 'YOUR_SUPABASE_SERVICE_KEY'))
    
    # Anon key (for frontend/public access - limited by RLS)
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY', 'YOUR_SUPABASE_ANON_KEY')
    
    SUPABASE_STORAGE_BUCKET = 'uchi-images'
    
    # File upload settings
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
