"""
Dynamic Urban Canopy Health Index (UCHI) - Flask Backend
Serves real CHI data from computer vision pipeline

This backend provides RESTful APIs for:
1. Health check
2. Real CHI data from CV pipeline
3. Results retrieval
4. Temporal comparison

Author: UCHI Development Team
Date: January 2026
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from pathlib import Path
import json

# Import modules
from database import Database
from chi_generator import CHIGenerator
from config import Config
from supabase_client import get_supabase

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize components
db = Database()  # Now uses Supabase
chi_gen = CHIGenerator()
supabase = get_supabase()  # Supabase client for Storage


def load_chi_results():
    """Load CHI results from JSON file"""
    results_file = Path('chi_results.json')
    
    if not results_file.exists():
        # Return None if results don't exist yet
        return None
    
    try:
        with open(results_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading results: {e}")
        return None


def calculate_trend(current_chi):
    """
    Calculate trend (mock for now - in production, compare with historical data)
    """
    # Simple mock: random small positive trend
    import random
    trend = random.uniform(0.5, 3.5)
    return f"+{trend:.1f}%"


@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    GET /health
    
    Returns:
        JSON with status, timestamp, version, and service availability
    """
    results = load_chi_results()
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'services': {
            'database': db.is_connected(),
            'storage': supabase is not None,
            'cvPipeline': results is not None
        }
    }), 200


@app.route('/chi/bangalore', methods=['GET'])
def get_bangalore_chi():
    """
    Get Bengaluru City Health Index
    Returns real data from CV pipeline
    """
    results = load_chi_results()
    
    if results is None or 'bangalore' not in results:
        # Fallback if pipeline hasn't run yet
        return jsonify({
            'error': 'No data available',
            'message': 'Run the CV pipeline first: python run_cv_pipeline.py',
            'chi': 0,
            'category': 'no_data',
            'metrics': {},
            'timestamp': datetime.now().isoformat()
        }), 503
    
    bangalore_data = results['bangalore']
    
    # Format response for dashboard (matching expected format)
    response = {
        'chi': bangalore_data['chi_score'],
        'category': bangalore_data['status'],
        'interpretation': bangalore_data['interpretation'],
        'areaType': 'Bengaluru',
        'timestamp': bangalore_data['timestamp'],
        'trend': calculate_trend(bangalore_data['chi_score']),
        'metrics': {
            'vegetation_coverage': bangalore_data['metrics']['vegetation_coverage'],
            'greenness_intensity': bangalore_data['metrics']['greenness_intensity'],
            'images_processed': bangalore_data['images_processed']
        },
        'location': 'Bengaluru',
        'images_analyzed': bangalore_data['images_processed']
    }
    
    return jsonify(response), 200


@app.route('/chi/rvce', methods=['GET'])
def get_rvce_chi():
    """
    Get RVCE Campus Health Index
    Returns real data from CV pipeline
    """
    results = load_chi_results()
    
    if results is None or 'rvce' not in results:
        return jsonify({
            'error': 'No data available',
            'message': 'Run the CV pipeline first: python run_cv_pipeline.py',
            'chi': 0,
            'category': 'no_data',
            'metrics': {},
            'timestamp': datetime.now().isoformat()
        }), 503
    
    rvce_data = results['rvce']
    
    response = {
        'chi': rvce_data['chi_score'],
        'category': rvce_data['status'],
        'interpretation': rvce_data['interpretation'],
        'areaType': 'RVCE',
        'timestamp': rvce_data['timestamp'],
        'trend': calculate_trend(rvce_data['chi_score']),
        'metrics': {
            'vegetation_coverage': rvce_data['metrics']['vegetation_coverage'],
            'greenness_intensity': rvce_data['metrics']['greenness_intensity'],
            'images_processed': rvce_data['images_processed']
        },
        'location': 'RVCE Campus',
        'images_analyzed': rvce_data['images_processed']
    }
    
    return jsonify(response), 200


@app.route('/api/all-locations', methods=['GET'])
def get_all_locations():
    """Get CHI data for all locations"""
    results = load_chi_results()
    
    if results is None:
        return jsonify({
            'error': 'No data available',
            'message': 'Run the CV pipeline first: python run_cv_pipeline.py'
        }), 503
    
    return jsonify(results), 200


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


@app.route('/get-rvce-summary', methods=['GET'])
def get_rvce_summary():
    """
    Get RVCE summary statistics
    GET /get-rvce-summary
    
    Returns:
        JSON with overall CHI, status, total analyses, and trends
    """
    try:
        summary = db.get_rvce_summary()
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def home():
    """Root endpoint with API info"""
    return jsonify({
        'service': 'Urban CHI Backend API',
        'version': '1.0.0',
        'endpoints': {
            '/health': 'Health check',
            '/chi/bangalore': 'Get Bengaluru City Health Index',
            '/chi/rvce': 'Get RVCE Campus Health Index',
            '/api/all-locations': 'Get all locations data',
            '/geometry/bangalore': 'Get Bengaluru GeoJSON',
            '/geometry/rvce': 'Get RVCE GeoJSON',
            '/get-results': 'Get all CHI results from database',
            '/get-bangalore-summary': 'Get Bengaluru summary',
            '/get-rvce-summary': 'Get RVCE summary',
            '/export/csv': 'Export all data as CSV',
            '/export/json': 'Export all data as JSON'
        },
        'instructions': 'Run run_cv_pipeline.py to generate CHI data'
    })


@app.route('/export/csv', methods=['GET'])
def export_csv():
    """
    Export all CHI results as CSV
    GET /export/csv
    
    Returns:
        CSV file download
    """
    from io import StringIO
    import csv
    
    try:
        # Load results from JSON
        results = load_chi_results()
        
        if results is None:
            return jsonify({
                'error': 'No data available',
                'message': 'Run the CV pipeline first: python run_cv_pipeline.py'
            }), 503
        
        # Create CSV in memory
        output = StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Location', 'CHI Score', 'Status', 'Vegetation Coverage (%)', 
            'Greenness Intensity', 'Images Processed', 'Date', 'Timestamp'
        ])
        
        # Write data
        for location, data in results.items():
            writer.writerow([
                data['location'],
                data['chi_score'],
                data['status'],
                data['metrics']['vegetation_coverage'],
                data['metrics']['greenness_intensity'],
                data['images_processed'],
                data.get('date', ''),
                data['timestamp']
            ])
        
        # Create response
        from flask import Response
        output.seek(0)
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=uchi_results.csv'}
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/export/json', methods=['GET'])
def export_json():
    """
    Export all CHI results as JSON
    GET /export/json
    
    Returns:
        JSON file download
    """
    try:
        # Load results from JSON
        results = load_chi_results()
        
        if results is None:
            return jsonify({
                'error': 'No data available',
                'message': 'Run the CV pipeline first: python run_cv_pipeline.py'
            }), 503
        
        # Get database results too
        db_results = db.get_all_results()
        
        # Combine data
        export_data = {
            'generated_at': datetime.now().isoformat(),
            'cv_pipeline_results': results,
            'database_records': db_results,
            'metadata': {
                'version': '1.0.0',
                'locations': list(results.keys()) if results else []
            }
        }
        
        from flask import Response
        import json
        
        return Response(
            json.dumps(export_data, indent=2),
            mimetype='application/json',
            headers={'Content-Disposition': 'attachment; filename=uchi_complete_export.json'}
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("Urban CHI Backend API")
    print("=" * 60)
    print("Starting Flask server on http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  - GET /health")
    print("  - GET /chi/bangalore")
    print("  - GET /chi/rvce")
    print("  - GET /api/all-locations")
    print("  - GET /geometry/bangalore")
    print("  - GET /geometry/rvce")
    print("\nMake sure to run run_cv_pipeline.py first to generate data!")
    print("=" * 60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)

