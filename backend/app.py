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

# Import modules
from database import Database
from chi_generator import CHIGenerator
from config import Config

# Import AI placeholder modules
# These will be implemented with actual AI logic later
import preprocessing
import vegetation_detection
import chi_calculation

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize components
db = Database(Config.DATABASE_PATH)
chi_gen = CHIGenerator()

# Ensure upload directory exists
Path(Config.UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)


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
            'storage': os.path.exists(Config.UPLOAD_FOLDER),
            'aiModule': False  # Will be True when AI is integrated
        }
    }), 200


@app.route('/upload-image', methods=['POST'])
def upload_image():
    """
    Image upload endpoint
    POST /upload-image
    
    Expected form data:
        - file: Image file (.jpg or .png)
        - area_type: "Bengaluru" or "RVCE"
        - sub_region: (optional) RVCE sub-region
        - date: Date of image capture (YYYY-MM-DD)
    
    Returns:
        JSON with CHI result
        
    Future integration:
        1. preprocessing.py - normalize and prepare image
        2. vegetation_detection.py - detect and segment vegetation
        3. chi_calculation.py - calculate actual CHI from vegetation data
    """
    try:
        # Validate request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Get metadata
        area_type = request.form.get('area_type')
        sub_region = request.form.get('sub_region')
        date = request.form.get('date')
        
        # Validate area type
        if area_type not in ['Bengaluru', 'RVCE']:
            return jsonify({'error': 'Invalid area_type. Must be Bengaluru or RVCE'}), 400
        
        # Validate RVCE sub-region if provided
        valid_sub_regions = ['Campus', 'Sports Ground', 'Parking', 'Hostel', 'Roadside']
        if area_type == 'RVCE' and sub_region not in valid_sub_regions:
            return jsonify({'error': f'Invalid sub_region. Must be one of: {valid_sub_regions}'}), 400
        
        # Save file
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # TODO: AI Integration Point
        # Uncomment and implement when AI modules are ready
        # ---------------------------------------------------
        # Step 1: Preprocess image
        # processed_image = preprocessing.preprocess_image(filepath)
        
        # Step 2: Detect vegetation
        # vegetation_mask = vegetation_detection.detect_vegetation(processed_image)
        
        # Step 3: Calculate CHI
        # chi_data = chi_calculation.calculate_chi(processed_image, vegetation_mask)
        # ---------------------------------------------------
        
        # For now, generate dummy CHI
        region = sub_region if sub_region else area_type
        chi_value = chi_gen.generate_chi(region)
        status = chi_gen.get_status(chi_value)
        interpretation = chi_gen.get_interpretation(status)
        
        # Generate dummy vegetation metrics
        vegetation_coverage = 30 + (chi_value / 100) * 50
        healthy_vegetation = 40 + (chi_value / 100) * 40
        stressed_vegetation = 100 - healthy_vegetation
        
        # Store metadata in database
        image_id = db.insert_image_metadata(
            filename=filename,
            filepath=filepath,
            area_type=area_type,
            sub_region=sub_region,
            date=date
        )
        
        # Store result
        result_id = db.insert_chi_result(
            image_id=image_id,
            area_type=area_type,
            sub_region=sub_region,
            chi_value=chi_value,
            status=status,
            interpretation=interpretation,
            date=date,
            vegetation_coverage=vegetation_coverage,
            healthy_vegetation=healthy_vegetation,
            stressed_vegetation=stressed_vegetation
        )
        
        # Return result
        result = {
            'id': result_id,
            'imageId': image_id,
            'areaType': area_type,
            'subRegion': sub_region,
            'chiValue': chi_value,
            'status': status,
            'interpretation': interpretation,
            'date': date,
            'vegetationCoverage': round(vegetation_coverage, 2),
            'healthyVegetation': round(healthy_vegetation, 2),
            'stressedVegetation': round(stressed_vegetation, 2)
        }
        
        return jsonify(result), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
    print(f"Database: {Config.DATABASE_PATH}")
    print(f"Upload folder: {Config.UPLOAD_FOLDER}")
    print(f"Server running on: http://localhost:{Config.PORT}")
    print("=" * 60)
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
