# UCHI Backend

Backend server for the Dynamic Urban Canopy Health Index (UCHI) application.

## Features

- Flask REST API
- SQLite database for metadata and results storage
- Dummy CHI generation (ready for AI integration)
- Image upload and storage
- Temporal comparison analysis
- Region-wise results

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 3. Test the API

```bash
python test_api.py
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and service availability.

### Upload Image
```
POST /upload-image
Content-Type: multipart/form-data

Fields:
- file: Image file (.jpg or .png)
- area_type: "Bengaluru" or "RVCE"
- sub_region: (optional) "Campus", "Sports Ground", "Parking", "Hostel", or "Roadside"
- date: Date in YYYY-MM-DD format
```

### Get All Results
```
GET /get-results
```

### Get Bangalore Summary
```
GET /get-bangalore-summary
```

### Get RVCE Results
```
GET /get-rvce-results
```

### Temporal Comparison
```
GET /compare/<region>

Example: GET /compare/Campus
```

## Project Structure

```
backend/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── database.py               # Database operations
├── chi_generator.py          # Dummy CHI generation
├── preprocessing.py          # Image preprocessing (placeholder)
├── vegetation_detection.py   # Vegetation detection (placeholder)
├── chi_calculation.py        # CHI calculation (placeholder)
├── requirements.txt          # Python dependencies
├── test_api.py              # API tests
├── data/                    # Database files (auto-created)
└── uploads/                 # Uploaded images (auto-created)
```

## AI Integration Roadmap

The following modules are currently placeholders and need to be implemented with actual AI logic:

### 1. preprocessing.py
- Image normalization
- Resizing
- Noise reduction
- Color space conversion

**Recommended libraries:** OpenCV, PIL/Pillow

### 2. vegetation_detection.py
- Vegetation segmentation using deep learning
- Healthy vs stressed vegetation classification
- Coverage calculation

**Recommended approach:** 
- U-Net or DeepLabV3 for segmentation
- Train on satellite imagery datasets
- Use transfer learning from pre-trained models

### 3. chi_calculation.py
- Implement actual CHI algorithm
- Calculate spectral indices (NDVI, EVI)
- Combine multiple health indicators
- Region-specific calibration

**Formula (to be refined):**
```
CHI = w1 * coverage + w2 * health_ratio + w3 * canopy_density + w4 * spectral_index
```

## Database Schema

### image_metadata
- id (PRIMARY KEY)
- filename
- filepath
- area_type
- sub_region
- date
- uploaded_at
- created_at

### chi_results
- id (PRIMARY KEY)
- image_id (FOREIGN KEY)
- area_type
- sub_region
- chi_value
- status
- interpretation
- date
- vegetation_coverage
- healthy_vegetation
- stressed_vegetation
- created_at

## Configuration

Edit `config.py` to modify:
- Server host and port
- Database path
- Upload folder location
- CHI ranges by region
- Status thresholds

## Development Notes

### Current State
- ✅ REST API fully functional
- ✅ Database schema implemented
- ✅ Dummy CHI generation working
- ✅ File upload and storage working
- ⚠️ AI modules are placeholders

### Next Steps
1. Collect training data for vegetation segmentation
2. Train or fine-tune segmentation models
3. Implement preprocessing pipeline
4. Implement CHI calculation algorithm
5. Validate against ground truth data
6. Optimize performance

## Testing

The `test_api.py` script tests all endpoints. Run it after starting the server:

```bash
# Terminal 1
python app.py

# Terminal 2
python test_api.py
```

## CORS Configuration

CORS is enabled for all origins by default. In production, restrict to your frontend domain:

```python
# In app.py
CORS(app, resources={r"/*": {"origins": "https://your-frontend-domain.com"}})
```

## License

Part of the UCHI academic project.
