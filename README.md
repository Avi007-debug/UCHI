# Dynamic Urban Canopy Health Index (UCHI)

![UCHI Banner](https://img.shields.io/badge/UCHI-Vegetation%20Health%20Monitoring-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20Development-blue?style=for-the-badge)

> **🎯 NEW: Complete setup guides available!**
> - [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) - Full installation, viva prep, and troubleshooting
> - [DATASET_COMPILATION_GUIDE.md](./DATASET_COMPILATION_GUIDE.md) - Satellite data processing
> - [SUPABASE_INTEGRATION_GUIDE.md](./SUPABASE_INTEGRATION_GUIDE.md) - Database setup
> - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common errors & fixes

## 🌳 Overview

**Dynamic Urban Canopy Health Index (UCHI)** is a college-level web application for analyzing vegetation health in urban areas using satellite imagery. The system provides both macro-level (city-wide) and micro-level (campus-specific) analysis.

### Study Areas
- **Bengaluru**: City-wide vegetation assessment (Macro Level)
- **RV College of Engineering**: Detailed campus analysis (Micro Level)

## ✨ Features

- 🖼️ **Image Upload**: Drag-and-drop satellite imagery upload
- 📊 **CHI Calculation**: Automated Canopy Health Index computation
- 📈 **Temporal Analysis**: Compare vegetation health over time
- 🗺️ **Region-wise Analysis**: Detailed breakdown by sub-regions
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔄 **Real-time Updates**: Live data visualization

## 🚀 Quick Start

### Complete Setup Instructions

**👉 See [SETUP.md](./SETUP.md) for complete step-by-step installation guide!**

### Quick Commands

**Backend:**
```bash
cd backend
# Create .env with your Supabase credentials
pip install Flask==3.0.0 flask-cors==4.0.0 python-dotenv==1.0.0 supabase==2.3.4
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 📖 Documentation

- **[📝 Setup Guide](./SETUP.md)** - Complete installation and configuration
- [� Development Guide](./DEVELOPMENT_GUIDE.md) - Development workflow and best practices
- [🏗️ Architecture](./ARCHITECTURE.md) - System architecture and design
- [🔌 Backend API](./backend/README.md) - API endpoints and backend documentation
- [🤖 AI Integration Guide](./AI_INTEGRATION_GUIDE.md) - Future AI/ML integration roadmap

## 🏗️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Recharts

### Backend
- Python 3.9+
- Flask 3.0
- **Supabase** (PostgreSQL + Storage)
- Flask-CORS

### Future AI Integration
- TensorFlow/PyTorch
- OpenCV
- U-Net for segmentation

## 📊 Project Structure

```
UCHI/
├── frontend/              # React frontend application
│   ├── src/              # Source code
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── backend/              # Flask backend application
│   ├── app.py           # Main Flask application
│   ├── database.py      # Database operations
│   ├── supabase_client.py # Supabase integration
│   ├── chi_generator.py # CHI calculation logic
│   ├── preprocessing.py # Image preprocessing (AI ready)
│   ├── vegetation_detection.py # Vegetation detection (AI ready)
│   ├── chi_calculation.py # Advanced CHI calculation (AI ready)
│   └── requirements.txt # Backend dependencies
│
└── Documentation/         # Project documentation
    ├── README.md         # Project overview
    ├── SETUP.md          # Setup instructions
    ├── ARCHITECTURE.md   # System architecture
    ├── DEVELOPMENT_GUIDE.md # Development guide
    └── AI_INTEGRATION_GUIDE.md # AI integration roadmap
```

## 🎯 Current Status

- ✅ Complete React + TypeScript frontend
- ✅ Flask REST API backend
- ✅ Supabase (PostgreSQL + Storage) integration
- ✅ Image upload and storage
- ✅ CHI generation and visualization
- ✅ Temporal comparison features
- ✅ Region-wise analysis
- ⏳ AI-based image processing (planned)
- ⏳ Real-time vegetation detection (planned)
- ⏳ Advanced CHI calculation from spectral data (planned)

##  Screenshots

### Landing Page
Beautiful hero section with project introduction

### Study Area Selection
Choose between Bengaluru (Macro) or RVCE (Micro) analysis

### Upload & Analysis
Drag-and-drop image upload with instant CHI calculation

### Results Dashboard
Comprehensive visualization of vegetation health data

## 🧪 Testing

```bash
# Backend API tests
cd backend
python test_api.py

# Frontend build test
npm run build
npm run preview
```

## 🤝 Contributing

This is an academic project. For questions or suggestions:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

Academic project for RV College of Engineering

## 👥 Team

UCHI Development Team - RV College of Engineering

## 📞 Contact

For issues or questions, please create an issue in this repository.

---

**Made with 💚 for sustainable urban development**
