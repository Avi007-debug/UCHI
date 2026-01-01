# UCHI - Setup and Run Guide

## 📋 Prerequisites

Before starting, ensure you have installed:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **Python** 3.9 or higher ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

Verify installations:
```bash
node --version   # Should show v18.x or higher
python --version # Should show 3.9.x or higher
git --version    # Any recent version
```

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Avi007-debug/urban-canopy-health
cd urban-canopy-health
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (choose one)
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

✅ Frontend should now be running at: **http://localhost:5173**

### Step 3: Backend Setup

**Open a new terminal** (keep frontend running)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (Command Prompt):
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

✅ Backend should now be running at: **http://localhost:5000**

## 🎮 Using the Application

### Mode 1: Mock API (Default - No Backend Needed)

The app works out of the box with dummy data!

1. Just run: `npm run dev`
2. Open http://localhost:5173
3. Upload images and see dummy CHI values
4. Perfect for frontend development and testing

**Configuration:**
```typescript
// src/services/apiConfig.ts
export const USE_MOCK_API = true; // ✅ Default
```

### Mode 2: Real Backend API

To use the actual Flask backend:

1. Start backend: `cd backend && python app.py`
2. Update configuration:
   ```typescript
   // src/services/apiConfig.ts
   export const USE_MOCK_API = false; // Switch to real API
   ```
3. Restart frontend: `npm run dev`
4. Now uploads save to database!

## 🧪 Testing the Setup

### Test Frontend
1. Open http://localhost:5173
2. You should see the UCHI landing page
3. Click "Get Started" → Should navigate to Study Area page

### Test Backend
```bash
# In backend directory with venv activated
python test_api.py
```

Expected output:
```
=== Testing Health Check ===
Status Code: 200
✅ Health check passed

=== Testing Bangalore Summary ===
Status Code: 200
✅ Bangalore summary passed
...
```

### Test Full Integration
1. Ensure both frontend and backend are running
2. Set `USE_MOCK_API = false` in `apiConfig.ts`
3. Go to Upload page
4. Upload an image
5. Check database: `backend/data/uchi.db` should have new records
6. Check uploads folder: Image should be saved in `backend/uploads/`

## 📁 Folder Structure Overview

```
urban-canopy-health/
│
├── src/                      # Frontend React source
│   ├── components/           # UI components
│   ├── pages/               # Route pages
│   ├── services/            # API integration
│   │   ├── api.ts          # Main API (switches between mock/real)
│   │   ├── apiConfig.ts    # Configuration
│   │   ├── mockApi.ts      # Dummy data
│   │   └── realApi.ts      # Real Flask API calls
│   └── types/              # TypeScript types
│
├── backend/                  # Python Flask backend
│   ├── app.py              # Main Flask app with routes
│   ├── config.py           # Configuration
│   ├── database.py         # SQLite operations
│   ├── chi_generator.py    # Dummy CHI generation
│   │
│   ├── AI Placeholders (implement later):
│   ├── preprocessing.py
│   ├── vegetation_detection.py
│   └── chi_calculation.py
│   │
│   ├── data/               # SQLite database (auto-created)
│   ├── uploads/            # Uploaded images (auto-created)
│   └── requirements.txt    # Python dependencies
│
├── Documentation:
├── README.md               # Main readme
├── PROJECT_DOCUMENTATION.md
├── DEVELOPMENT_GUIDE.md
└── SETUP_GUIDE.md          # This file
```

## 🐛 Troubleshooting

### Issue: "Port 5173 already in use"
**Solution:**
```bash
# Find and kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Or change port in backend/config.py:
PORT = 5001  # Use different port
```

### Issue: "Module not found" (Python)
**Solution:**
```bash
# Make sure virtual environment is activated
# You should see (venv) in your terminal prompt

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "CORS error in browser console"
**Solution:**
- Make sure backend is running
- Check `USE_MOCK_API` setting in `apiConfig.ts`
- Verify CORS is enabled in `backend/app.py`

### Issue: "Database locked"
**Solution:**
```bash
# Close all connections and restart backend
# If persists, delete and recreate database:
cd backend
rm data/uchi.db
python app.py  # Will recreate database
```

### Issue: Frontend shows blank page
**Solution:**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 🎯 Quick Commands Reference

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Backend
```bash
python app.py           # Start Flask server
python test_api.py      # Run API tests
pip freeze > requirements.txt  # Update requirements
```

## 🔄 Switching Between Mock and Real API

**To use Mock API (no backend needed):**
```typescript
// src/services/apiConfig.ts
export const USE_MOCK_API = true;
```

**To use Real Backend:**
```typescript
// src/services/apiConfig.ts
export const USE_MOCK_API = false;
export const BACKEND_URL = 'http://localhost:5000';
```

## 📊 Default Data

On first run, the backend automatically creates:
- Sample RVCE region data (5 regions)
- Sample Bengaluru data
- All with dummy CHI values

You can upload new images to add more data!

## 🎓 For Evaluation/Demo

**Recommended Demo Flow:**

1. **Start both servers** (frontend + backend)
2. **Set to real API mode** (`USE_MOCK_API = false`)
3. **Show landing page** - Explain project overview
4. **Navigate to Study Area** - Show Bengaluru vs RVCE
5. **Upload an image** - Demonstrate full flow
6. **Show Results** - Display CHI calculations
7. **Compare regions** - Show temporal analysis
8. **Explain AI placeholders** - Discuss future integration

## 📝 Notes

- Database file: `backend/data/uchi.db` (SQLite)
- Uploaded images: `backend/uploads/`
- Both directories are auto-created on first run
- You can delete both to reset the application

## ✅ Verification Checklist

Before demo/evaluation, verify:
- [ ] Frontend loads at localhost:5173
- [ ] Backend health check works: http://localhost:5000/health
- [ ] Can upload an image
- [ ] Results display correctly
- [ ] Database has records
- [ ] Images saved in uploads folder
- [ ] All pages navigate correctly
- [ ] No console errors

## 🎉 Success!

If everything is working:
- ✅ Frontend shows beautiful UI
- ✅ Backend returns data
- ✅ Images upload successfully
- ✅ CHI values display
- ✅ Ready for demo/evaluation!

## 📚 Next Steps

1. ✅ **Current**: Using dummy CHI values
2. 🔜 **Next**: Implement AI modules
   - Train vegetation detection model
   - Implement actual CHI calculation
   - Add image preprocessing
3. 🚀 **Future**: Deploy to production

---

**Need help?** Check the documentation files or create an issue in the repository.

**Happy Developing! 🌳**
