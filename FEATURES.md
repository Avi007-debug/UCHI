# UCHI - Complete Features & Setup Guide

**Urban Canopy Health Index - Vegetation Monitoring System**

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Quick Setup](#quick-setup)
3. [Computer Vision Pipeline](#computer-vision-pipeline)
4. [API Reference](#api-reference)
5. [Frontend Features](#frontend-features)
6. [Database Schema](#database-schema)
7. [Customization Guide](#customization-guide)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

UCHI is a vegetation health monitoring system that processes satellite/aerial imagery to calculate the **Canopy Health Index (CHI)** - a quantitative measure of urban green cover.

### **Key Components**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **CV Pipeline** | OpenCV + NumPy | Vegetation detection & CHI calculation |
| **Backend** | Flask + Python | REST API server |
| **Database** | Supabase PostgreSQL | Data storage & retrieval |
| **Frontend** | React + TypeScript | User interface |
| **Maps** | Leaflet | Geospatial visualization |

### **Study Areas**
- **Bengaluru** (City-wide): Macro-level urban vegetation analysis
- **RVCE Campus** (Institution): Micro-level green space tracking

---

## ⚡ Quick Setup

### **Step 1: Environment Setup**

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### **Step 2: Database Configuration**

Create `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_STORAGE_BUCKET=uchi-images
```

Run schema in Supabase SQL Editor:
```sql
-- Copy and execute backend/supabase_schema.sql
```

### **Step 3: Add Images**

```
backend/datasets/
  ├── bangalore/
  │   ├── image1.png
  │   ├── image2.png
  │   └── ...
  └── rvce/
      ├── image1.png
      ├── image2.png
      └── ...
```

**Image Requirements:**
- Format: PNG, JPG, JPEG
- Content: Satellite/aerial views of vegetation
- Quality: Clear, good lighting
- Season: Green season preferred (monsoon)

### **Step 4: Process Images**

```bash
cd backend
python run_cv_pipeline.py
```

This will:
1. ✅ Process all images in datasets folders
2. ✅ Calculate CHI scores
3. ✅ Save results to Supabase
4. ✅ Generate `chi_results.json`

### **Step 5: Start Services**

```bash
# Terminal 1: Backend
cd backend
python app.py  # Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev    # Runs on http://localhost:5173
```

---

## 🔬 Computer Vision Pipeline

### **Algorithm Overview**

```
Image → Preprocessing → HSV Conversion → Green Detection → Metrics → CHI
```

### **1. Preprocessing**
```python
# Resize to standard dimensions
resized = cv2.resize(image, (512, 512))

# Convert to HSV color space
hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
```

### **2. Vegetation Detection**
```python
# HSV thresholds for green vegetation
lower_green = np.array([25, 30, 30])   # H, S, V lower
upper_green = np.array([95, 255, 255]) # H, S, V upper

# Create binary mask
vegetation_mask = cv2.inRange(hsv, lower_green, upper_green)
```

**HSV Ranges:**
- **Hue (25-95)**: Green to yellow-green colors
- **Saturation (30-255)**: Moderate to high color intensity
- **Value (30-255)**: Handles shadows and lighting variations

### **3. Metrics Calculation**

**Vegetation Coverage:**
```python
total_pixels = mask.size
vegetation_pixels = np.count_nonzero(mask)
coverage = (vegetation_pixels / total_pixels) * 100
```

**Greenness Intensity:**
```python
# Extract S and V channels from vegetation areas
saturation = hsv[:, :, 1][mask > 0]
value = hsv[:, :, 2][mask > 0]

# Calculate weighted average
avg_saturation = np.mean(saturation) / 255 * 100
avg_value = np.mean(value) / 255 * 100
greenness = (avg_saturation * 0.6) + (avg_value * 0.4)
```

### **4. CHI Formula**

```python
CHI = (coverage * 0.7) + (greenness_intensity * 0.3)
```

**Rationale:**
- **Coverage (70%)**: Spatial extent more important
- **Intensity (30%)**: Quality indicator

### **5. Status Classification**

| CHI Range | Status | Interpretation |
|-----------|--------|---------------|
| 80-100 | Excellent | Outstanding urban vegetation |
| 70-79 | Good | Healthy vegetation cover |
| 50-69 | Moderate | Adequate but room for improvement |
| 30-49 | Poor | Limited vegetation requiring intervention |
| 0-29 | Critical | Severe vegetation deficit |

---

## 🔌 API Reference

### **Base URL**
```
http://localhost:5000
```

### **Endpoints**

#### **1. Health Check**
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-16T...",
  "version": "1.0.0",
  "services": {
    "database": true,
    "storage": true
  }
}
```

#### **2. Get Bengaluru CHI**
```http
GET /chi/bangalore
```

**Response:**
```json
{
  "chi": 48.72,
  "category": "Moderate",
  "interpretation": "Adequate vegetation but room for improvement",
  "areaType": "Bengaluru",
  "metrics": {
    "vegetation_coverage": 42.15,
    "greenness_intensity": 63.41,
    "images_processed": 13
  },
  "timestamp": "2026-01-16T...",
  "date": "2026-01-16"
}
```

#### **3. Get RVCE CHI**
```http
GET /chi/rvce
```

Same response format as Bengaluru.

#### **4. Get All Locations**
```http
GET /api/all-locations
```

Returns both Bengaluru and RVCE data.

#### **5. Get GeoJSON Boundary**
```http
GET /geometry/bangalore
GET /geometry/rvce
```

**Response:**
```json
{
  "type": "Feature",
  "properties": {
    "name": "Bengaluru",
    "areaType": "city"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[...]]
  }
}
```

#### **6. Get Database Results**
```http
GET /get-results
GET /get-bangalore-summary
GET /get-rvce-summary
```

---

## 🎨 Frontend Features

### **Dashboard Page**
- Live CHI scores
- Status indicators
- Trend analysis
- Recent updates

### **Map View**
- Interactive Leaflet map
- Polygon boundaries for study areas
- Click to view details
- Layer controls

### **Results Page**
- Detailed CHI breakdown
- Historical data table
- Temporal comparison charts

### **Upload Page** (Future)
- Drag-and-drop image upload
- Processing status
- Immediate CHI calculation

### **Components Used**

| Component | Library | Purpose |
|-----------|---------|---------|
| `<MapView />` | Leaflet | Interactive maps |
| `<CHIDisplay />` | Custom | Score visualization |
| `<CHICard />` | shadcn/ui | Metric cards |
| `<RegionTable />` | Tanstack Table | Data display |
| `<CHIBarChart />` | Recharts | Trend visualization |

---

## 🗄️ Database Schema

### **`chi_results` Table**

```sql
CREATE TABLE chi_results (
  id BIGSERIAL PRIMARY KEY,
  image_id BIGINT REFERENCES image_metadata(id),
  area_type TEXT NOT NULL,  -- 'Bengaluru' or 'RVCE'
  sub_region TEXT,
  chi_value REAL NOT NULL,  -- 0-100
  status TEXT NOT NULL,     -- Excellent/Good/Moderate/Poor/Critical
  interpretation TEXT NOT NULL,
  date DATE NOT NULL,
  vegetation_coverage REAL,
  healthy_vegetation REAL,
  stressed_vegetation REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **`image_metadata` Table**

```sql
CREATE TABLE image_metadata (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  area_type TEXT NOT NULL,
  sub_region TEXT,
  date DATE NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚙️ Customization Guide

### **Adjust HSV Thresholds**

Edit `backend/vegetation_detection.py`:

```python
class VegetationDetector:
    def __init__(self):
        # Current settings
        self.lower_green = np.array([25, 30, 30])
        self.upper_green = np.array([95, 255, 255])
        
        # For yellowish vegetation (dry season)
        # self.lower_green = np.array([20, 25, 25])
        # self.upper_green = np.array([110, 255, 255])
        
        # For dense green only (monsoon)
        # self.lower_green = np.array([35, 50, 50])
        # self.upper_green = np.array([85, 255, 255])
```

### **Modify CHI Formula**

Edit `backend/chi_calculation.py`:

```python
@staticmethod
def calculate_chi(vegetation_coverage, greenness_intensity):
    # Current: 70/30 split
    chi_score = (vegetation_coverage * 0.7) + (greenness_intensity * 0.3)
    
    # Alternative: Equal weights
    # chi_score = (vegetation_coverage * 0.5) + (greenness_intensity * 0.5)
    
    # Alternative: Coverage-focused
    # chi_score = (vegetation_coverage * 0.9) + (greenness_intensity * 0.1)
    
    return np.clip(chi_score, 0, 100)
```

### **Add New Location**

1. Create folder: `backend/datasets/your_location/`
2. Add images to folder
3. Edit `run_cv_pipeline.py`:

```python
locations = [
    ('bangalore', 'Bengaluru'),
    ('rvce', 'RVCE'),
    ('your_location', 'Your Location Name')  # Add this
]
```

4. Update database schema to accept new area type (if needed)

---

## 🔧 Troubleshooting

### **Low CHI Scores**

**Symptom:** CHI < 20% when you expect higher

**Diagnosis:**
```bash
python diagnose_images.py
```

Check `debug_output/` folder for:
- Green overlays showing what's detected
- Binary masks showing pixel-level detection

**Solutions:**
1. **Widen HSV range** - Include more color variations
2. **Better images** - Use monsoon/green season photos
3. **Remove screenshots** - Delete non-satellite images
4. **Adjust V threshold** - Lower to catch shadowed areas

### **Database Errors**

**Symptom:** "Failed to save to database"

**Check:**
```bash
python -c "from database import Database; print(Database().is_connected())"
```

**Solutions:**
1. Verify `.env` credentials
2. Check Supabase dashboard - tables created?
3. Run `supabase_schema.sql` again
4. Ensure `image_id` column allows NULL

### **Frontend Not Loading**

**Symptom:** "No data available"

**Check:**
1. Does `chi_results.json` exist?
2. Is Flask running on port 5000?
3. Check browser console for CORS errors

**Solutions:**
```bash
# Re-run pipeline
python run_cv_pipeline.py

# Check JSON exists
cat chi_results.json

# Restart Flask
python app.py
```

### **Import Errors**

**Symptom:** "ModuleNotFoundError: No module named 'cv2'"

**Solution:**
```bash
pip install opencv-python numpy
```

---

## 📊 Expected Results

### **Good Images** (Parks, Gardens)
- Coverage: 40-80%
- CHI: 50-90
- Status: Moderate to Excellent

### **Urban Images** (Buildings, Roads)
- Coverage: 5-25%
- CHI: 10-35
- Status: Critical to Poor

### **Screenshot/Low Quality**
- Coverage: 0-5%
- CHI: 0-10
- Status: Critical

---

## 🚀 Production Deployment

### **Backend (Flask)**
- Deploy on Render, Railway, or AWS
- Update CORS settings
- Set environment variables

### **Frontend (React)**
- Build: `npm run build`
- Deploy on Vercel, Netlify, or Cloudflare Pages
- Update `BACKEND_URL` in `apiConfig.ts`

### **Database (Supabase)**
- Already cloud-hosted
- Configure RLS policies
- Set up backup schedule

---

## 📝 License

MIT License - Free to use and modify

---

## 🙏 Credits

- **OpenCV** - Computer vision library
- **Supabase** - Database & storage
- **Leaflet** - Mapping
- **React** - UI framework
- **shadcn/ui** - Component library

---

**For more information, see [README.md](README.md)**
