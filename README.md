# Urban Canopy Health Index (UCHI)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)

**A real-time urban vegetation health monitoring system using computer vision and geospatial analysis.**

Track, analyze, and visualize canopy health across cities and campuses to support urban sustainability and ecological planning.

---

## � Problem Statement

Existing urban vegetation indices (e.g., NDVI, EVI) rely on multispectral data (near-infrared bands) and global thresholds, limiting their interpretability and applicability in heterogeneous urban environments. There is a lack of **lightweight, reproducible frameworks** that provide **context-aware vegetation health assessment** using widely available RGB imagery.

### Key Contributions

1. **A deterministic, RGB-based Canopy Health Index (CHI)**  
   - No training required, fully reproducible results
   - Weighted formula combining coverage (70%) and greenness quality (30%)

2. **Area-aware interpretation** (city, campus, park)  
   - Context-sensitive thresholds: same CHI score interpreted differently based on area type
   - Reflects urban ecology expectations (parks should be greener than dense cities)

3. **Fully reproducible, training-free CV pipeline**  
   - Classical computer vision (HSV color segmentation)
   - Deterministic operations guarantee identical results for identical inputs

4. **End-to-end system from imagery to geospatial visualization**  
   - Automated batch processing, database storage, interactive maps, and data export
   - Open-source implementation with comprehensive documentation

---

## �🌳 Features

### **Computer Vision Pipeline**
- **HSV-based Vegetation Detection**: Rule-based green vegetation identification from RGB images
- **Canopy Health Index (CHI)**: Quantitative measure (0-100) combining coverage and quality
- **Area-Aware Color Grading**: Context-sensitive thresholds for city, campus, and park areas
- **Smooth Gradient Coloring**: Professional visualization with interpolated color transitions
- **Batch Processing**: Automated analysis of multiple satellite/aerial images
- **Real-time Visualization**: Green overlay masks showing detected vegetation

### **Geospatial Analysis**
- **Interactive Maps**: Leaflet-based visualization with polygon boundaries
- **Multi-location Support**: Compare CHI across urban areas (Bengaluru City, RVCE Campus, Cubbon Park)
- **Area-Type Differentiation**: Cities, campuses, and parks evaluated with appropriate baselines
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
# If upgrading from old data, also run the UPDATE statements in the migration section
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
backend/datasets/cubbon/     # Cubbon Park images
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

## 📊 Why Classical Computer Vision Instead of Deep Learning?

| Aspect | NDVI-based | CNN-based | UCHI (This Work) |
|--------|------------|-----------|------------------|
| **Requires NIR** | ✅ Yes | ⚠️ Optional | ❌ No (RGB only) |
| **Requires labels** | ❌ No | ✅ Yes (thousands) | ❌ No (training-free) |
| **Interpretability** | 🔴 Low (opaque formula) | 🔴 Low (black box) | 🟢 **High** (explicit rules) |
| **Area-aware** | ❌ No | ⚠️ Rare | ✅ **Yes** (city/campus/park) |
| **Deployment cost** | 🟡 Medium (NIR sensors) | 🔴 High (GPU, cloud) | 🟢 **Low** (CPU, deterministic) |
| **Reproducibility** | 🟢 High | 🟡 Medium (training variance) | 🟢 **100%** (fixed pipeline) |
| **Dataset requirements** | Multispectral imagery | Large labeled Indian datasets | RGB satellite images |
| **Computational needs** | Moderate | High (training + inference) | **Low** (simple operations) |

### Design Rationale

**Why we chose classical CV over CNNs:**

1. **No large labeled Indian datasets available**  
   - Existing datasets (LOVEDA, DeepGlobe) trained on Western/Chinese cities
   - Domain shift issues when applied to Indian urban vegetation

2. **Emphasis on interpretability over pixel-level accuracy**  
   - Urban planners need understandable metrics, not black-box predictions
   - HSV thresholds can be adjusted and explained to stakeholders

3. **Reduced computational and deployment cost**  
   - Runs on standard laptops without GPU
   - No cloud infrastructure or model hosting required

4. **Deterministic and reproducible**  
   - Same input always produces same output (critical for research)
   - No training randomness or hyperparameter sensitivity

**Trade-off**: We accept lower pixel-level precision in exchange for interpretability, zero training requirements, and deployment simplicity.

---

## 📊 How It Works

### **Methodology Flow**

```
Satellite Images → Preprocessing → Vegetation Mask → Metrics → CHI → Database → Visualization
       ↓              ↓                  ↓             ↓        ↓        ↓            ↓
   RGB files      Resize 512×512    HSV Filter    Coverage  Formula  Supabase   Interactive
   (JPG/PNG)      Filter <5%        (25-95°H)    Greenness  (0-100)  Storage      Maps
```

**Detailed Pipeline**: See [RESEARCH_DOCUMENTATION.md](RESEARCH_DOCUMENTATION.md#-methodology-flow-diagram) for complete flow diagram.

### **CHI Calculation**
```python
CHI = (vegetation_coverage × 0.7) + (greenness_intensity × 0.3)
```

**Components:**
- **Vegetation Coverage (70%)**: Percentage of image area with green vegetation
- **Greenness Intensity (30%)**: Quality metric based on HSV saturation/value

**Why 70/30 weights?**  
Coverage prioritized because urban planning focuses on total canopy extent. See [sensitivity analysis](RESEARCH_DOCUMENTATION.md#-chi-sensitivity-analysis) for detailed justification.

**Area-Aware Status Levels:**

Different area types have different baseline expectations:

🏙️ **City (e.g., Bengaluru)** - Lower thresholds due to urban density:
- 🟠 **Poor** (< 20): Severe vegetation deficit
- 🟡 **Moderate** (20-35): Limited but acceptable
- 🟢 **Good** (> 35): Healthy for urban context

🏫 **Campus (e.g., RVCE)** - Moderate expectations:
- 🔴 **Critical/Poor** (< 25): Needs intervention
- 🟠 **Moderate** (25-40): Room for improvement
- 🟢 **Good** (> 40): Well-maintained green space

🌳 **Park (e.g., Cubbon Park)** - Higher expectations:
- 🟠 **Poor** (< 30): Below park standards
- 🟡 **Good** (30-45): Adequate park vegetation
- 🟢 **Excellent** (> 45): Exceptional park health

**Why Area-Aware?** Parks should have more vegetation than dense cities. Same CHI score (e.g., 30) means different things: "Good" for a city, "Poor" for a park. See [AREA_AWARE_COLOR_SYSTEM.md](AREA_AWARE_COLOR_SYSTEM.md) for technical details.

### **Detection Algorithm**
1. **Preprocessing**: Resize images to 512×512, filter <5% coverage, convert RGB to HSV
2. **Color Segmentation**: Apply HSV thresholds (H: 25-95, S: 30-255, V: 30-255)
3. **Pixel Counting**: Calculate vegetation vs total pixels
4. **Greenness Metric**: Average saturation and value in vegetation areas
5. **CHI Computation**: Weighted formula for final score

**Reproducibility**: 100% deterministic - same dataset yields identical results. No randomness, no ML training variance.

---

## ⚠️ Limitations & Assumptions

**Critical for Research Use:**

1. **RGB-Based Estimation**: Measures visual greenness, NOT plant physiological health (cannot detect stress/disease)
2. **No Ground-Truth Validation**: Scores are relative indicators, not calibrated against field measurements
3. **Aggregate Index**: Provides area-wide average, not pixel-precise spatial mapping
4. **Seasonal Dependence**: Dry season shows lower CHI due to leaf shedding

**Full Details**: See [RESEARCH_DOCUMENTATION.md](RESEARCH_DOCUMENTATION.md#%EF%B8%8F-limitations--assumptions) for complete limitations analysis.

**Suitable For**: Urban trends, comparative analysis, policy assessment  
**NOT Suitable For**: Plant disease diagnosis, precision agriculture, species identification

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
GET  /chi/cubbon            # Cubbon Park CHI
GET  /geometry/bangalore    # GeoJSON boundary
GET  /geometry/rvce         # GeoJSON boundary
GET  /geometry/cubbon       # GeoJSON boundary  
GET  /get-results           # All database results
GET  /export/csv            # Export data as CSV
GET  /export/json           # Export complete dataset
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

## � Documentation

**Two comprehensive documentation files:**

1. **[README.md](README.md)** (this file) - Quick start, setup, API reference, troubleshooting
2. **[RESEARCH_DOCUMENTATION.md](RESEARCH_DOCUMENTATION.md)** - Research quality documentation

### Research Documentation Highlights

📖 **RESEARCH_DOCUMENTATION.md** includes:
- ⚠️ **Limitations & Assumptions** - RGB-based estimation, no ground-truth validation, seasonal dependence
- 📊 **Methodology Flow Diagram** - Complete ASCII pipeline visualization
- 🎯 **CHI Sensitivity Analysis** - Quantitative impact: coverage (+48%), greenness (-23%), combined (+149%)
- 🔬 **Reproducibility Statement** - 100% deterministic pipeline, FAIR principles compliance
- 📚 **Academic References** - Supporting literature (Smith 1978, Gamon 1995, Weinstein 2018)
- ✅ **Suitable Applications** - Urban planning, campus sustainability, policy assessment
- ❌ **Unsuitable Applications** - Plant disease diagnosis, precision agriculture, species ID

### Technical Summary

UCHI uses **rule-based computer vision** for transparency:
- **No ML Dependencies**: Pure OpenCV HSV color segmentation (H: 25-95°, S: 30-255, V: 30-255)
- **No NDVI Calculation**: RGB-only, no NIR bands required  
- **No Complex Models**: Lightweight, interpretable algorithm (512×512 resize, pixel counting)
- **Scientifically Defensible**: Clear metrics, documented thresholds, reproducible results

**Formula**: `CHI = (vegetation_coverage × 0.7) + (greenness_intensity × 0.3)`

---

## 🎨 Color Scheme & Visual Guide

### **Area-Aware Color Coding**

UCHI uses **context-sensitive color thresholds** that adapt to different area types:

#### 🏙️ City (Bengaluru) - Urban Baseline
```
CHI < 20        → 🔴 Red (Critical/Poor)
CHI 20-35       → 🟠 Orange (Poor/Moderate)
CHI > 35        → 🟡 Yellow (Moderate/Good)
```
**Rationale**: Dense urban areas have limited space for vegetation. Lower thresholds reflect realistic expectations.

#### 🏫 Campus (RVCE) - Managed Green Space Baseline
```
CHI < 25        → 🔴 Red (Critical/Poor)
CHI 25-40       → 🟠 Orange (Poor/Moderate)
CHI > 40        → 🟡 Yellow (Moderate/Good)
```
**Rationale**: Campus areas are managed spaces with moderate vegetation potential.

#### 🌳 Park (Cubbon Park) - Dedicated Vegetation Baseline
```
CHI < 30        → 🔴 Red (Poor)
CHI 30-36       → 🟠 Orange (Moderate)
CHI 36-45       → 🟢 Light Green (Good)
CHI > 45        → 🟢 Dark Green (Excellent)
```
**Rationale**: Parks are dedicated green spaces expected to have high vegetation. Higher thresholds ensure accurate assessment.

### **Smooth Gradient Coloring**

Colors blend seamlessly between thresholds (no harsh boundaries):
- **Example**: Cubbon Park at CHI 37.86 shows **light green** (blend of yellow + green)
- **Benefit**: Professional visualization, easy interpretation

### **Scientific Justification**

Urban ecology research shows land-use type significantly affects baseline vegetation indices:
- **Same CHI, Different Meaning**: CHI 30 is "Good" for a city (limited space) but "Moderate" for a park (should be greener)
- **Context-Sensitive Assessment**: Accurate evaluation requires area-type awareness
- **Research Precedent**: NDVI thresholds vary by land use type in published studies

**Visual Guide**: The Dashboard and Results pages display an interactive color scheme guide showing all thresholds and their meanings.

---

## 🗄️ Database Migration

### **For New Installations**
Simply run the schema file in Supabase:
```sql
-- Copy entire backend/supabase_schema.sql into Supabase SQL Editor and execute
```

### **For Existing Databases (Upgrading from Old Versions)**

If you have existing data with legacy `area_type` values ('Bengaluru', 'RVCE'), you need to migrate:

1. **Open Supabase Dashboard** → SQL Editor
2. **Run the main schema**: Paste contents of `backend/supabase_schema.sql`
3. **Migrate old data**: Uncomment and run the UPDATE statements in the migration section:
   ```sql
   UPDATE image_metadata SET area_type = 'city' WHERE area_type = 'Bengaluru';
   UPDATE image_metadata SET area_type = 'campus' WHERE area_type = 'RVCE';
   UPDATE image_metadata SET area_type = 'park' WHERE area_type = 'Cubbon Park';
   
   UPDATE chi_results SET area_type = 'city' WHERE area_type = 'Bengaluru';
   UPDATE chi_results SET area_type = 'campus' WHERE area_type = 'RVCE';
   UPDATE chi_results SET area_type = 'park' WHERE area_type = 'Cubbon Park';
   ```

**Migration Order**: The schema file handles this automatically - old data is updated before new constraints are enforced.

**Verification**:
```sql
SELECT DISTINCT area_type FROM chi_results;
-- Should return: city, campus, park (no old values)
```

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
