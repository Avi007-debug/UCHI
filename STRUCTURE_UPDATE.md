# 🏗️ Updated Project Structure

## ✅ Reorganization Complete!

The project has been reorganized with separate **frontend** and **backend** folders at the root level.

## 📁 New Structure

```
urban-canopy-health/
│
├── 📚 Documentation (Root Level)
│   ├── README.md                    ← Project overview
│   ├── SETUP_GUIDE.md              ← Installation guide
│   ├── QUICK_REFERENCE.md          ← Quick commands
│   ├── PROJECT_DOCUMENTATION.md    ← Full documentation
│   ├── ARCHITECTURE.md             ← System architecture
│   ├── DEVELOPMENT_GUIDE.md        ← Dev workflow
│   ├── AI_INTEGRATION_GUIDE.md     ← AI roadmap
│   ├── ACADEMIC_SUMMARY.md         ← For evaluation
│   └── DOCUMENTATION_INDEX.md      ← Documentation hub
│
├── 🎨 frontend/                     ← Frontend Application
│   ├── src/
│   │   ├── components/             ← React components (30+)
│   │   ├── pages/                  ← Route pages (6)
│   │   ├── services/               ← API layer
│   │   │   ├── api.ts             ← Main API (auto-switches)
│   │   │   ├── apiConfig.ts       ← Configuration (USE_MOCK_API)
│   │   │   ├── mockApi.ts         ← Development mode
│   │   │   └── realApi.ts         ← Production mode
│   │   └── types/                  ← TypeScript definitions
│   │
│   ├── public/                     ← Static assets
│   ├── package.json               ← Frontend dependencies
│   ├── vite.config.ts             ← Vite config
│   ├── tsconfig.json              ← TypeScript config
│   ├── tailwind.config.ts         ← Tailwind config
│   └── .gitignore                 ← Frontend ignore rules
│
└── 🐍 backend/                      ← Backend Application
    ├── app.py                      ← Main Flask server (250+ lines)
    ├── database.py                 ← SQLite operations (350+ lines)
    ├── config.py                   ← Configuration
    ├── chi_generator.py            ← Dummy CHI generation
    │
    ├── 🤖 AI Modules (Placeholders)
    ├── preprocessing.py            ← Image preprocessing
    ├── vegetation_detection.py     ← Vegetation segmentation
    └── chi_calculation.py          ← CHI computation
    │
    ├── test_api.py                ← API test suite
    ├── requirements.txt            ← Python dependencies
    ├── README.md                   ← Backend docs
    ├── .gitignore                 ← Backend ignore rules
    │
    ├── data/                       ← Database storage (auto-created)
    │   └── uchi.db                ← SQLite database
    │
    └── uploads/                    ← Image uploads (auto-created)
        └── [uploaded images]
```

## 🚀 Updated Commands

### Frontend Commands
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Commands
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py

# Run API tests
python test_api.py
```

### Full Stack Development
**Terminal 1 (Backend):**
```bash
cd backend
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## 🔄 API Configuration

The API configuration file has moved:

**Old Location:** `src/services/apiConfig.ts`  
**New Location:** `frontend/src/services/apiConfig.ts`

```typescript
// frontend/src/services/apiConfig.ts

// Development mode (no backend needed)
export const USE_MOCK_API = true;

// Production mode (connects to Flask backend)
export const USE_MOCK_API = false;
export const BACKEND_URL = 'http://localhost:5000';
```

## 📝 What Changed

### ✅ Moved to `frontend/` folder:
- ✅ `src/` directory
- ✅ `public/` directory
- ✅ `package.json` and `package-lock.json`
- ✅ `bun.lockb`
- ✅ `index.html`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json` (all TypeScript configs)
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.js`
- ✅ `eslint.config.js`
- ✅ `components.json`

### ✅ Stayed in `backend/` folder:
- ✅ All Python files
- ✅ `requirements.txt`
- ✅ `data/` directory
- ✅ `uploads/` directory

### ✅ Stayed at root level:
- ✅ All documentation files (`.md`)
- ✅ Root `.gitignore`

## 🎯 Benefits of New Structure

1. **Clear Separation** - Frontend and backend are independent
2. **Easy Deployment** - Deploy each part separately
3. **Better Organization** - Follows industry standards
4. **Team-Friendly** - Frontend and backend devs can work independently
5. **Scalable** - Easy to add microservices or additional backends

## 📚 Documentation Updates

All documentation has been updated to reflect the new structure:
- ✅ README.md
- ✅ SETUP_GUIDE.md
- ✅ QUICK_REFERENCE.md
- ✅ PROJECT_DOCUMENTATION.md
- ✅ DEVELOPMENT_GUIDE.md

## ✅ Everything Still Works!

- ✅ Frontend dev server: `cd frontend && npm run dev`
- ✅ Backend server: `cd backend && python app.py`
- ✅ Mock API mode: Works without backend
- ✅ Real API mode: Connects to Flask backend
- ✅ All features functional
- ✅ Database operations working
- ✅ File uploads working

## 🎉 Ready to Use!

The project is ready to use with the new structure. Simply:

1. Navigate to the appropriate folder (`frontend/` or `backend/`)
2. Run the commands as documented
3. Everything works as before!

---

**Last Updated:** January 1, 2026  
**Status:** ✅ Reorganization Complete  
**All Systems:** ✅ Operational
