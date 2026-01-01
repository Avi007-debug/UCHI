# Dynamic Urban Canopy Health Index (UCHI)

![UCHI Banner](https://img.shields.io/badge/UCHI-Vegetation%20Health%20Monitoring-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20Development-blue?style=for-the-badge)

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
- [📚 Project Documentation](./PROJECT_DOCUMENTATION.md) - Project overview
- [🔧 Development Guide](./DEVELOPMENT_GUIDE.md) - Development workflow
- [🔌 Backend API](./backend/README.md) - API endpoints
- [🤖 AI Integration Guide](./AI_INTEGRATION_GUIDE.md) - Add real AI processing

## 🏗️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Recharts10+
- Flask 3.0
- **Supabase** (PostgreSQL + Storage)
- Flask-CORSend
- Python 3.9+
- Flask
- SQLite
- Flask-CORS

### Future AI Integration
- TensorFlow/PyTorch
- OpenCV
- U-Net for segmentation

## 📊 Project Structure

```
urbafrontend/              # Frontend application
│   ├── src/              # React source code
│   │   ├── components/   # React components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # Backend application
│   ├── app.py           # Flask application
│   ├── database.py      # Database operations
│   ├── preprocessing.py # AI placeholder
│   ├── vegetation_detection.py
│   ├── chi_calculation.py
│   └── requirements.txt # Backend dependencies
└── Documentation files   # Project documentation
└── public/               # Static assets
```

## 🎯 Current Status

- ✅ Complete React frontend
- ✅ Flask REST API backend
- ✅ SQLite database integration
- ✅ Dummy CHI generation
- ✅ Mock and real API support
- ⏳ AI image processing (planned)
- ⏳ Actual CHI calculation (planned)

## 🔄 API Configuration

Switch between mock and real API:

```typescript
// src/services/apiConfig.ts
export const USE_MOCK_API = true;  // false for real backend
```

## 📸 Screenshots

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
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
