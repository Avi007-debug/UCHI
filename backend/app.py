"""
Dynamic Urban Canopy Health Index (UCHI) - Flask Backend
Main application file with API endpoints

This backend provides RESTful APIs for:
1. Health check
2. Image upload and metadata storage
3. Dummy CHI generation
4. Results retrieval
5. Temporal comparison

Author: UCHI Development Team
Date: January 2026
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from pathlib import Path
import io

# Import modules
from database import Database
from chi_generator import CHIGenerator
from config import Config
from supabase_client import get_supabase

# Import AI placeholder modules
# These will be implemented with actual AI logic later
import preprocessing
import vegetation_detection
import chi_calculation

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize components
db = Database()  # Now uses Supabase
chi_gen = CHIGenerator()
supabase = get_supabase()  # Supabase client for Storage


@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    GET /health
    
    Returns:
        JSON with status, timestamp, version, and service availability
    """
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'services': {
            'database': db.is_connected(),
            'storage': supabase is not None,
            'aiModule': False  # Will be True when AI is integrated
        }
    }), 200


@app.route('/chi/bangalore', methods=['GET'])
def get_bangalore_chi():
    """
    Get precomputed CHI for Bengaluru
    GET /chi/bangalore
    
    Returns:
        JSON with CHI value and category
    """
    # Precomputed CHI value for Bengaluru
    chi_value = 62.5
    status = chi_gen.get_status(chi_value)
    
    return jsonify({
        'chi': chi_value,
        'category': status,
        'interpretation': chi_gen.get_interpretation(status),
        'areaType': 'Bengaluru'
    }), 200


@app.route('/chi/rvce', methods=['GET'])
def get_rvce_chi():
    """
    Get precomputed CHI for RVCE
    GET /chi/rvce
    
    Returns:
        JSON with CHI value and category
    """
    # Precomputed CHI value for RVCE
    chi_value = 71.3
    status = chi_gen.get_status(chi_value)
    
    return jsonify({
        'chi': chi_value,
        'category': status,
        'interpretation': chi_gen.get_interpretation(status),
        'areaType': 'RVCE'
    }), 200


@app.route('/geometry/bangalore', methods=['GET'])
def get_bangalore_geometry():
    """
    Get Bengaluru boundary geometry
    GET /geometry/bangalore
    
    Returns:
        GeoJSON polygon for Bengaluru city boundary
    """
    # Simplified Bengaluru boundary (approximate coordinates)
    # In production, this would be loaded from a GeoJSON file
    geometry = {
        "type": "Feature",
        "properties": {
            "name": "Bengaluru",
            "areaType": "city"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.4601, 12.8340],  # Northwest
                [77.7600, 12.8340],  # Northeast
                [77.7600, 12.7340],  # Southeast
                [77.4601, 12.7340],  # Southwest
                [77.4601, 12.8340]   # Close polygon
            ]]
        }
    }
    
    return jsonify(geometry), 200


@app.route('/geometry/rvce', methods=['GET'])
def get_rvce_geometry():
    """
    Get RVCE campus boundary geometry
    GET /geometry/rvce
    
    Returns:
        GeoJSON polygon for RVCE campus boundary
    """
    # RVCE campus boundary (approximate coordinates)
    # In production, this would be loaded from a GeoJSON file
    geometry = {
        "type": "Feature",
        "properties": {
            "name": "RV College of Engineering",
            "areaType": "campus"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.4987, 12.9236],  # Northwest corner
                [77.5020, 12.9236],  # Northeast corner
                [77.5020, 12.9210],  # Southeast corner
                [77.4987, 12.9210],  # Southwest corner
                [77.4987, 12.9236]   # Close polygon
            ]]
        }
    }
    
    return jsonify(geometry), 200


@app.route('/get-results', methods=['GET'])
def get_results():
    """
    Get all CHI results
    GET /get-results
    
    Returns:
        JSON array of all CHI results
    """
    try:
        results = db.get_all_results()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get-bangalore-summary', methods=['GET'])
def get_bangalore_summary():
    """
    Get Bengaluru summary statistics
    GET /get-bangalore-summary
    
    Returns:
        JSON with overall CHI, status, total analyses, and trends
    """
    try:
        summary = db.get_bangalore_summary()
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get-rvce-results', methods=['GET'])
def get_rvce_results():
    """
    Get RVCE region-wise results
    GET /get-rvce-results
    
    Returns:
        JSON array of RVCE results grouped by region
    """
    try:
        results = db.get_rvce_results()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/compare/<region>', methods=['GET'])
def compare_temporal(region):
    """
    Temporal comparison endpoint
    GET /compare/<region>
    
    Args:
        region: Region name (Bengaluru, Campus, Sports Ground, etc.)
    
    Returns:
        JSON with comparison of last two CHI values
    """
    try:
        comparison = db.get_temporal_comparison(region)
        if not comparison:
            return jsonify({'error': f'No data available for region: {region}'}), 404
        return jsonify(comparison), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Dynamic Urban Canopy Health Index (UCHI) Backend")
    print("=" * 60)
    print(f"Database: Supabase PostgreSQL")
    print(f"Storage: Supabase Storage (bucket: {Config.SUPABASE_STORAGE_BUCKET})")
    print(f"Server running on: http://localhost:{Config.PORT}")
    print("=" * 60)
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
