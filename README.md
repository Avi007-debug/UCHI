# Urban Canopy Health Index (UCHI)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)

**A real-time urban vegetation health monitoring system using computer vision and geospatial analysis.**

Track, analyze, and visualize canopy health across cities and campuses to support urban sustainability and ecological planning.

---

## 🌳 Features

### **Computer Vision Pipeline**
- **HSV-based Vegetation Detection**: Rule-based green vegetation identification from RGB images
- **Canopy Health Index (CHI)**: Quantitative measure (0-100) combining coverage and quality
- **Batch Processing**: Automated analysis of multiple satellite/aerial images
- **Real-time Visualization**: Green overlay masks showing detected vegetation

### **Geospatial Analysis**
- **Interactive Maps**: Leaflet-based visualization with polygon boundaries
- **Multi-location Support**: Compare CHI across different urban areas (Bengaluru & RVCE)
- **Temporal Tracking**: Monitor vegetation changes over time
- **GeoJSON Integration**: Standard format for boundary data

### **Dashboard & Analytics**
- **Live CHI Scores**: Real-time display of vegetation health metrics
- **Status Indicators**: Excellent, Good, Moderate, Poor, Critical
- **Trend Analysis**: Track improvements or decline over time
- **Detailed Reports**: Coverage percentages, greenness intensity, interpretations

---

## 🚀 Quick Start

### **Prerequisites**
- Python 3.8+
- Node.js 18+
- Supabase account (for database)

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/UCHI.git
cd UCHI
```

### **2. Backend Setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
```

Create `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_STORAGE_BUCKET=uchi-images
```

Run database schema in Supabase SQL Editor:
```bash
# Copy contents of backend/supabase_schema.sql and run in Supabase dashboard
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
```

### **4. Add Images**
Place satellite/aerial images in:
```
backend/datasets/bangalore/  # Bengaluru city images
backend/datasets/rvce/       # RVCE campus images
```

### **5. Run CV Pipeline**
```bash
cd backend
python run_cv_pipeline.py
```

Expected output: Processing images, calculating CHI, saving to database

### **6. Start Services**
```bash
# Terminal 1: Backend
cd backend
python app.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

---

## 📊 How It Works

### **CHI Calculation**
```python
CHI = (vegetation_coverage × 0.7) + (greenness_intensity × 0.3)
```

**Components:**
- **Vegetation Coverage (70%)**: Percentage of image area with green vegetation
- **Greenness Intensity (30%)**: Quality metric based on HSV saturation/value

**Status Levels:**
- 🟢 **Excellent** (80-100): Outstanding urban vegetation
- 🟢 **Good** (70-79): Healthy vegetation cover
- 🟡 **Moderate** (50-69): Adequate but improvable
- 🟠 **Poor** (30-49): Limited vegetation
- 🔴 **Critical** (0-29): Severe vegetation deficit

### **Detection Algorithm**
1. **Preprocessing**: Resize images to 512×512, convert RGB to HSV
2. **Color Segmentation**: Apply HSV thresholds (H: 25-95, S: 30-255, V: 30-255)
3. **Pixel Counting**: Calculate vegetation vs total pixels
4. **Greenness Metric**: Average saturation and value in vegetation areas
5. **CHI Computation**: Weighted formula for final score

---

## 🗂️ Project Structure

```
UCHI/
├── backend/
│   ├── app.py                      # Flask API server
│   ├── run_cv_pipeline.py          # Batch image processor
│   ├── vegetation_detection.py     # HSV-based detection
│   ├── chi_calculation.py          # CHI formula
│   ├── database.py                 # Supabase integration
│   ├── diagnose_images.py          # Diagnostic tool
│   ├── datasets/
│   │   ├── bangalore/              # Bengaluru images
│   │   └── rvce/                   # RVCE images
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API integration
│   │   └── types/                  # TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
├── README.md                       # This file
└── FEATURES.md                     # Detailed features guide
```

---

## 🔧 Configuration

### **HSV Thresholds** (adjust in `vegetation_detection.py`)
```python
lower_green = np.array([25, 30, 30])  # H, S, V lower bounds
upper_green = np.array([95, 255, 255])  # H, S, V upper bounds
```

**Tuning Tips:**
- **Yellowish vegetation**: Increase upper H to 100-110
- **Shadowed areas**: Decrease lower V to 20-25
- **Dry season**: Widen H range to 20-110

### **API Endpoints**
```
GET  /health                 # Health check
GET  /chi/bangalore          # Bengaluru CHI
GET  /chi/rvce              # RVCE CHI
GET  /geometry/bangalore    # GeoJSON boundary
GET  /geometry/rvce         # GeoJSON boundary
GET  /get-results           # All database results
```

---

## 📈 Usage Examples

### **Run Diagnostics**
```bash
cd backend
python diagnose_images.py
```
Creates `debug_output/` with vegetation detection visualizations.

### **Test API**
```bash
curl http://localhost:5000/chi/bangalore
```

### **Update HSV Thresholds**
Edit `backend/vegetation_detection.py` and re-run pipeline.

---

## 🛠️ Troubleshooting

**Low CHI Scores (<20%)**
1. Run `python diagnose_images.py` to visualize detection
2. Check if images show mostly buildings/infrastructure
3. Adjust HSV thresholds for your vegetation type
4. Use images from green season (monsoon)

**Database Connection Error**
1. Verify `.env` has correct Supabase credentials
2. Run `python -c "from database import Database; print(Database().is_connected())"`
3. Check Supabase dashboard for table creation

**Frontend Shows "No Data"**
1. Ensure `python run_cv_pipeline.py` completed successfully
2. Check `chi_results.json` exists in backend folder
3. Verify Flask server is running on port 5000

---

## 📝 Research & Methodology

UCHI uses **rule-based computer vision** instead of ML models for transparency and explainability:

- **No ML Dependencies**: Pure OpenCV HSV color segmentation
- **No NDVI Calculation**: RGB-only, no NIR bands required
- **No Complex Models**: Lightweight, interpretable algorithm
- **Scientifically Defensible**: Clear metrics, documented thresholds

Suitable for:
- Urban planning assessments
- Campus sustainability tracking
- Environmental impact studies
- Green space policy research

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional vegetation indices (SAVI, EVI)
- Machine learning enhancements
- Mobile app development
- Time-series forecasting
- Climate correlation analysis

---

## 📄 License

MIT License - see LICENSE file

---

## 👥 Team

**RVCE Team** - Urban Canopy Health Index Project

---

## 📞 Contact

**Issues**: GitHub Issues  
**Documentation**: See FEATURES.md for detailed guide

---

**Built with ❤️ for sustainable urban development**
