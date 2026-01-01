# Dynamic Urban Canopy Health Index (UCHI)

## 🌳 Project Overview

The **Dynamic Urban Canopy Health Index (UCHI)** is a college-level web application designed to analyze and monitor vegetation health in urban areas using satellite imagery. The system provides both macro-level (city-wide) and micro-level (campus-specific) analysis of green cover quality.

### Study Areas
1. **Bengaluru (Macro Level)**: City-wide vegetation health assessment
2. **RV College of Engineering (Micro Level)**: Detailed campus vegetation analysis with region-specific insights

## 🎯 Features

### Current Implementation
- ✅ Complete React + TypeScript frontend with modern UI
- ✅ Python Flask backend with RESTful APIs
- ✅ SQLite database for data storage
- ✅ Image upload and metadata management
- ✅ Dummy CHI (Canopy Health Index) generation
- ✅ Region-wise analysis and comparison
- ✅ Temporal comparison (trend analysis)
- ✅ Responsive design with shadcn/ui components
- ✅ Mock and Real API switching support

### Future Enhancements (AI Integration)
- ⏳ Image preprocessing pipeline
- ⏳ AI-based vegetation detection
- ⏳ Actual CHI calculation from spectral analysis
- ⏳ Advanced vegetation health classification
- ⏳ Multi-temporal analysis

## 🏗️ Architecture

```
urban-canopy-health/
├── frontend/           (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/ (Reusable UI components)
│   │   ├── pages/      (Route pages)
│   │   ├── services/   (API integration)
│   │   └── types/      (TypeScript definitions)
│   └── public/
│
└── backend/            (Python Flask)
    ├── app.py          (Main Flask app)
    ├── database.py     (SQLite operations)
    ├── chi_generator.py (Dummy CHI generation)
    ├── preprocessing.py (AI placeholder)
    ├── vegetation_detection.py (AI placeholder)
    ├── chi_calculation.py (AI placeholder)
    └── data/           (Database storage)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/bun
- **Python** 3.9+
- **Git**

### Frontend Setup

```bash
# Navigate to project directory
cd urban-canopy-health/frontend

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The frontend will start on `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The backend will start on `http://localhost:5000`

## 📡 API Configuration

The frontend can work in two modes:

### 1. Mock API Mode (Default)
- Uses dummy data generated in the frontend
- No backend connection required
- Perfect for frontend development and testing

```typescript
// frontend/src/services/apiConfig.ts
export const USE_MOCK_API = true;
```

### 2. Real API Mode
- Connects to Flask backend
- Full database integration
- Required for production

```typescript
// frontend/src/services/apiConfig.ts
export const USE_MOCK_API = false;
export const BACKEND_URL = 'http://localhost:5000';
```

## 📊 CHI Ranges (Canopy Health Index)

| Region | CHI Range | Expected Status |
|--------|-----------|-----------------|
| Bengaluru | 55-70 | Good to Excellent |
| RVCE Campus | 65-80 | Good to Excellent |
| Sports Ground | 60-75 | Good to Excellent |
| Parking | 40-55 | Moderate to Good |
| Roadside | 40-55 | Moderate to Good |
| Hostel | 55-70 | Good to Excellent |

### Status Categories
- **Excellent** (75-100): Exceptional vegetation health
- **Good** (60-74): Healthy vegetation
- **Moderate** (45-59): Mixed health signals
- **Poor** (30-44): Significant stress
- **Critical** (0-29): Severe degradation

## 🗂️ Database Schema

### image_metadata
Stores uploaded image information
- `id`: Primary key
- `filename`: Original filename
- `filepath`: Server storage path
- `area_type`: Bengaluru or RVCE
- `sub_region`: RVCE sub-region (optional)
- `date`: Date of image capture
- `uploaded_at`: Upload timestamp

### chi_results
Stores analysis results
- `id`: Primary key
- `image_id`: Foreign key to image_metadata
- `area_type`: Region type
- `sub_region`: Specific region
- `chi_value`: Calculated CHI (0-100)
- `status`: Health status category
- `interpretation`: Detailed explanation
- `vegetation_coverage`: Percentage
- `healthy_vegetation`: Percentage
- `stressed_vegetation`: Percentage
- `date`: Analysis date

## 🧪 Testing

### Backend API Testing
```bash
cd backend
python test_api.py
```

### Frontend Testing
```bash
npm run build
npm run preview
```

## 📚 Technology Stack

### Frontend
- **React** 18+
- **TypeScript** 5+
- **Vite** 5+
- **TailwindCSS** 3+
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend
- **Python** 3.9+
- **Flask** 3.0+
- **SQLite** - Database
- **Flask-CORS** - Cross-origin support

### Future AI Stack (Planned)
- **TensorFlow** or **PyTorch** - Deep learning
- **OpenCV** - Image processing
- **NumPy** - Numerical operations
- **Scikit-image** - Image analysis

## 🔮 AI Integration Roadmap

### Phase 1: Preprocessing (preprocessing.py)
- Image normalization and resizing
- Noise reduction
- Color space conversion
- Contrast enhancement

### Phase 2: Vegetation Detection (vegetation_detection.py)
- Semantic segmentation using U-Net/DeepLab
- Vegetation vs non-vegetation classification
- Healthy vs stressed vegetation detection
- Coverage calculation

### Phase 3: CHI Calculation (chi_calculation.py)
- Implement scientific CHI formula
- Calculate spectral indices (NDVI, EVI)
- Analyze canopy density
- Region-specific calibration

### Phase 4: Model Training
- Collect labeled satellite imagery
- Train segmentation models
- Validate against ground truth
- Fine-tune for Indian vegetation

## 📄 License

This project is developed for academic purposes at RV College of Engineering.

## 👥 Contributors

UCHI Development Team - RV College of Engineering

## 📞 Support

For issues or questions, please create an issue in the project repository.

---

**Last Updated**: January 2026
**Version**: 1.0.0
