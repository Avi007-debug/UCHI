# UCHI Dataset Compilation & Processing Guide

## 📊 Dataset Structure Overview

The UCHI project processes satellite imagery to calculate vegetation health indices. Here's the complete workflow for compiling and processing your dataset.

---

## 1. Dataset Organization

### Folder Structure
```
UCHI/
├── backend/
│   ├── data/
│   │   ├── raw_images/              # Original satellite images
│   │   │   ├── bangalore/
│   │   │   │   ├── bangalore_2024_01_15.tif
│   │   │   │   ├── bangalore_2024_02_15.tif
│   │   │   │   └── bangalore_2024_03_15.tif
│   │   │   └── rvce/
│   │   │       ├── rvce_sports_ground_2024_01_15.tif
│   │   │       ├── rvce_campus_buildings_2024_01_15.tif
│   │   │       ├── rvce_parking_2024_01_15.tif
│   │   │       └── rvce_hostel_2024_01_15.tif
│   │   ├── processed_images/        # After preprocessing
│   │   │   ├── bangalore/
│   │   │   └── rvce/
│   │   ├── vegetation_masks/        # Binary vegetation masks
│   │   │   ├── bangalore/
│   │   │   └── rvce/
│   │   └── chi_results/             # Final CHI outputs
│   │       ├── bangalore/
│   │       └── rvce/
│   └── pipeline_results.json        # Batch processing results
```

### Required Data Format

**Input Images:**
- Format: GeoTIFF (.tif) or JPEG/PNG for RGB images
- Resolution: 10m to 30m per pixel (Sentinel-2/Landsat quality)
- Channels: RGB (Red, Green, Blue)
- Naming Convention: `{region}_{sub_region}_{YYYY_MM_DD}.{ext}`

**Example Filenames:**
```
bangalore_2024_01_15.tif
rvce_sports_ground_2024_01_15.jpg
rvce_campus_buildings_2024_02_20.tif
```

---

## 2. Data Acquisition

### Option A: Sentinel-2 Satellite Imagery (Recommended - FREE)

**Step 1: Access Copernicus Open Access Hub**
```
Website: https://scihub.copernicus.eu/
1. Create free account
2. Search for your area of interest (Bengaluru: 12.9716°N, 77.5946°E)
3. Filter: Sentinel-2, Cloud cover < 10%, Date range
4. Download L2A products (atmospherically corrected)
```

**Step 2: Extract RGB Bands**
```bash
# Using GDAL tools (install: pip install gdal)
cd C:\Coding\UCHI\backend\data\raw_images\bangalore

# Extract RGB from Sentinel-2 bands
gdal_merge.py -separate -o bangalore_2024_01_15.tif \
  B04.jp2 \  # Red band
  B03.jp2 \  # Green band
  B02.jp2    # Blue band
```

### Option B: Google Earth Engine (Python API)

**Install Earth Engine:**
```bash
pip install earthengine-api
```

**Download Script:**
```python
# save as: download_sentinel_data.py
import ee
import geemap

# Initialize Earth Engine
ee.Authenticate()
ee.Initialize()

# Define area of interest (Bengaluru)
bangalore_aoi = ee.Geometry.Rectangle([77.4, 12.8, 77.8, 13.2])

# Get Sentinel-2 image
image = ee.ImageCollection('COPERNICUS/S2_SR') \
    .filterBounds(bangalore_aoi) \
    .filterDate('2024-01-01', '2024-01-31') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) \
    .median()

# Select RGB bands
rgb = image.select(['B4', 'B3', 'B2'])

# Export
task = ee.batch.Export.image.toDrive(
    image=rgb,
    description='bangalore_2024_01',
    scale=10,
    region=bangalore_aoi
)
task.start()
```

### Option C: Drone Imagery (For RVCE Campus)

**Requirements:**
- RGB drone camera
- Flight altitude: 50-100m
- Overlap: 70-80% between images
- Processing: Stitch using Pix4D/DroneDeploy

---

## 3. Preprocessing Pipeline

### Step 1: Validate Images

**Run validation script:**
```bash
cd C:\Coding\UCHI\backend
python scripts/validate_dataset.py
```

**Create validation script:**
```python
# scripts/validate_dataset.py
import os
from pathlib import Path
from PIL import Image
import numpy as np

def validate_image(filepath):
    """Validate image format and quality"""
    try:
        img = Image.open(filepath)
        img_array = np.array(img)
        
        # Check dimensions
        if img_array.shape[0] < 100 or img_array.shape[1] < 100:
            return False, "Image too small (min 100x100 pixels)"
        
        # Check channels
        if len(img_array.shape) != 3 or img_array.shape[2] != 3:
            return False, "Image must be RGB (3 channels)"
        
        # Check if not blank
        if img_array.mean() < 10 or img_array.mean() > 245:
            return False, "Image appears blank or overexposed"
        
        return True, "Valid"
    except Exception as e:
        return False, str(e)

def main():
    data_dir = Path(__file__).parent.parent / "data" / "raw_images"
    
    for region in ["bangalore", "rvce"]:
        region_path = data_dir / region
        if not region_path.exists():
            print(f"❌ Missing folder: {region_path}")
            continue
        
        images = list(region_path.glob("*.tif")) + list(region_path.glob("*.jpg"))
        print(f"\n📁 {region.upper()}: {len(images)} images")
        
        for img_path in images:
            valid, msg = validate_image(img_path)
            status = "✅" if valid else "❌"
            print(f"  {status} {img_path.name}: {msg}")

if __name__ == "__main__":
    main()
```

### Step 2: Run CV Pipeline

**Automated batch processing:**
```bash
cd C:\Coding\UCHI\backend
python run_cv_pipeline.py
```

**This script will:**
1. Load all images from `data/raw_images/`
2. Apply preprocessing (resize, normalize, enhance)
3. Detect vegetation using NDVI proxy
4. Calculate CHI values
5. Save results to `pipeline_results.json`
6. Store processed data in respective folders

**Output (pipeline_results.json):**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "regions_processed": {
    "Bengaluru": {
      "chi": 62.5,
      "category": "Good",
      "images_processed": 12,
      "date_range": "2024-01-01 to 2024-03-31"
    },
    "RVCE_Sports_Ground": {
      "chi": 78.2,
      "category": "Excellent",
      "images_processed": 8
    }
  }
}
```

---

## 4. Manual Processing (Advanced)

### Step-by-Step CV Processing

**1. Preprocessing:**
```python
from preprocessing import preprocess_image

# Load and preprocess
input_path = "data/raw_images/bangalore/bangalore_2024_01_15.tif"
processed_img = preprocess_image(input_path)
```

**2. Vegetation Detection:**
```python
from vegetation_detection import detect_vegetation

# Create vegetation mask
vegetation_mask = detect_vegetation(processed_img)
vegetation_percentage = (vegetation_mask > 0).sum() / vegetation_mask.size * 100
print(f"Vegetation coverage: {vegetation_percentage:.2f}%")
```

**3. CHI Calculation:**
```python
from chi_calculation import calculate_chi

# Calculate CHI value
chi_value = calculate_chi(vegetation_mask)
print(f"CHI: {chi_value:.2f}")
```

---

## 5. Quality Control Checklist

Before running the pipeline:

- [ ] All images are in correct folder structure
- [ ] Images are RGB format (3 channels)
- [ ] Filenames follow naming convention
- [ ] No corrupted or blank images
- [ ] Cloud cover < 20% for satellite images
- [ ] At least 3-5 images per region for temporal analysis
- [ ] Date metadata is accurate

**Run quality check:**
```bash
python scripts/validate_dataset.py
```

---

## 6. Updating Precomputed CHI Values

After processing new data, update the backend:

**Edit `backend/app.py`:**
```python
@app.route('/chi/bangalore', methods=['GET'])
def get_bangalore_chi():
    # Update this value from pipeline_results.json
    chi_value = 62.5  # ← Change this
    status = chi_gen.get_status(chi_value)
    
    return jsonify({
        'chi': chi_value,
        'category': status,
        'interpretation': chi_gen.get_interpretation(status),
        'areaType': 'Bengaluru'
    }), 200
```

**Or automate with script:**
```python
# scripts/update_chi_values.py
import json

# Load results
with open('pipeline_results.json', 'r') as f:
    results = json.load(f)

# Extract CHI values
bangalore_chi = results['regions_processed']['Bengaluru']['chi']
rvce_chi = results['regions_processed']['RVCE']['chi']

# Update app.py (requires manual verification)
print(f"Update app.py with these values:")
print(f"Bengaluru CHI: {bangalore_chi}")
print(f"RVCE CHI: {rvce_chi}")
```

---

## 7. Dataset for Viva Demo

### Minimal Working Dataset

For demonstration purposes, you need:

**Bengaluru (City-level):**
- 1-2 satellite images covering city bounds
- Date: Recent (within 6 months)
- Format: GeoTIFF or high-res JPEG

**RVCE Campus:**
- 1 image per sub-region (4 total):
  - Sports Ground
  - Campus Buildings
  - Parking Area
  - Hostel Blocks

**Quick Download Script:**
```python
# Use mock data for viva demo
import requests
from PIL import Image
import numpy as np

def generate_mock_vegetation_image(output_path, chi_target=60):
    """Generate synthetic vegetation image for demo"""
    # Create 1000x1000 RGB image
    img = np.random.randint(0, 255, (1000, 1000, 3), dtype=np.uint8)
    
    # Add green channel bias based on CHI
    green_boost = int(chi_target * 2.55)
    img[:, :, 1] = np.clip(img[:, :, 1] + green_boost, 0, 255)
    
    # Save
    Image.fromarray(img).save(output_path)
    print(f"✅ Generated: {output_path}")

# Generate demo dataset
generate_mock_vegetation_image("data/raw_images/bangalore/bangalore_demo.jpg", chi_target=62)
generate_mock_vegetation_image("data/raw_images/rvce/rvce_sports.jpg", chi_target=78)
generate_mock_vegetation_image("data/raw_images/rvce/rvce_campus.jpg", chi_target=68)
```

---

## 8. Troubleshooting

### Issue: "No images found in raw_images/"
**Fix:** Ensure folder structure exists and images are in correct locations

### Issue: "Memory error during processing"
**Fix:** Process images one at a time, reduce resolution:
```python
# In preprocessing.py, reduce target size
TARGET_SIZE = (512, 512)  # Instead of (2048, 2048)
```

### Issue: "NDVI values all zero"
**Fix:** Check if images have sufficient green channel variation

---

## Next Steps

1. ✅ Organize your raw images
2. ✅ Run validation script
3. ✅ Execute CV pipeline
4. ✅ Update CHI values in app.py
5. ✅ Connect to Supabase (see SUPABASE_INTEGRATION_GUIDE.md)
6. ✅ Test dashboard visualization

**Continue to:** [SUPABASE_INTEGRATION_GUIDE.md](./SUPABASE_INTEGRATION_GUIDE.md)
