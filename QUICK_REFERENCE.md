# 🚀 UCHI Quick Reference Card

## ⚡ Quick Start (2 Steps)

### Development Mode (Mock API - No Backend Needed)
```bash
cd frontend
npm install && npm run dev
```
Open: http://localhost:5173 ✅

### Production Mode (With Backend)
**Terminal 1:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2:**
```bash
cd frontend
# Update: src/services/apiConfig.ts → USE_MOCK_API = false
npm run dev
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `frontend/src/services/apiConfig.ts` | **Switch Mock ↔ Real API** |
| `backend/app.py` | **Main Flask server** |
| `backend/database.py` | **All database operations** |
| `backend/config.py` | **Backend configuration** |
| `frontend/src/App.tsx` | **Frontend routes** |
| `frontend/src/pages/Upload.tsx` | **Image upload page** |

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Server status |
| POST | `/upload-image` | Upload & analyze |
| GET | `/get-results` | All results |
| GET | `/get-bangalore-summary` | BLR summary |
| GET | `/get-rvce-results` | RVCE regions |
| GET | `/compare/{region}` | Temporal comparison |

---

## 📊 CHI Ranges

| Region | Range | Expected |
|--------|-------|----------|
| Bengaluru | 55-70 | Good |
| Campus | 65-80 | Excellent |
| Sports Ground | 60-75 | Good-Excellent |
| Parking | 40-55 | Moderate |
| Roadside | 40-55 | Moderate |
| Hostel | 55-70 | Good |

---

## 🎨 Color Coding

| Status | CHI Range | Color |
|--------|-----------|-------|
| Excellent | 75-100 | 🟢 Green |
| Good | 60-74 | 🟡 Light Green |
| Moderate | 45-59 | 🟠 Orange |
| Poor | 30-44 | 🔴 Red |
| Critical | 0-29 | 🔴 Dark Red |

---

## 🛠️ Common Commands

### Frontend
```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Backend
```bash
python app.py           # Start Flask
python test_api.py      # Run tests
pip freeze > requirements.txt  # Update deps
```

---

## 🐛 Troubleshooting

### Issue: Port in use
```bash
# Kill process on port 5173 (frontend)
# Windows: netstat -ano | findstr :5173
# Linux/Mac: lsof -ti:5173 | xargs kill -9

# Kill process on port 5000 (backend)
# Windows: netstat -ano | findstr :5000
# Linux/Mac: lsof -ti:5000 | xargs kill -9
```

### Issue: CORS error
- ✅ Check backend is running
- ✅ Check `USE_MOCK_API` in `apiConfig.ts`
- ✅ Verify CORS in `backend/app.py`

### Issue: Database locked
```bash
cd backend
rm data/uchi.db  # Delete database
python app.py    # Recreates automatically
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| README.md | Project overview |
| PROJECT_DOCUMENTATION.md | Complete details |
| SETUP_GUIDE.md | Installation guide |
| DEVELOPMENT_GUIDE.md | Dev workflow |
| AI_INTEGRATION_GUIDE.md | AI roadmap |
| ACADEMIC_SUMMARY.md | Evaluation summary |

---

## 🔄 Switch API Mode

**Mock API (Default - No Backend):**
```typescript
// src/services/apiConfig.ts
export const USE_MOCK_API = true;
```

**Real Backend:**
```typescript
// src/services/apiConfig.ts
export const USE_MOCK_API = false;
export const BACKEND_URL = 'http://localhost:5000';
```

---

## 🎯 Demo Flow

1. **Landing Page** → Show overview
2. **Study Area** → Select RVCE
3. **Upload** → Upload image
4. **Results** → Show CHI
5. **Compare** → Show trends
6. **Code** → Show architecture

---

## 📦 Project Structure

```
urban-canopy-health/
├── src/              # Frontend
│   ├── components/   # UI components
│   ├── pages/       # Routes
│   └── services/    # API layer
└── backend/         # Backend
    ├── app.py       # Flask app
    ├── database.py  # DB operations
    ├── data/        # SQLite DB
    └── uploads/     # Images
```

---

## ✅ Pre-Demo Checklist

- [ ] Frontend runs on :5173
- [ ] Backend runs on :5000
- [ ] Can upload image
- [ ] CHI displays correctly
- [ ] Database has data
- [ ] All pages work
- [ ] No console errors

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder
# Set: USE_MOCK_API = false
# Set: BACKEND_URL = 'https://your-backend.com'
```

### Backend (Railway)
```bash
# Add Procfile: web: python app.py
# Set CORS to frontend URL
# Deploy
```

---

## 💡 Tips

- **Development**: Use Mock API
- **Testing**: Use Real Backend
- **Demo**: Use Real Backend with sample data
- **Production**: Deploy both and connect

---

## 🎓 For Evaluation

**Show:**
1. ✅ Full-stack implementation
2. ✅ Working application
3. ✅ Clean code
4. ✅ Comprehensive docs
5. ✅ AI-ready architecture

**Explain:**
- Current: Dummy CHI values
- Future: AI integration path
- Architecture: Modular design
- Tech Stack: Modern tools

---

## 📞 Quick Help

**Frontend not loading?**
→ Check port 5173, clear cache, reinstall deps

**Backend not responding?**
→ Check port 5000, verify venv activated

**Upload not working?**
→ Check API mode in apiConfig.ts

**Need help?**
→ Check documentation files!

---

**Last Updated**: January 2026  
**Status**: ✅ Ready for Use & Evaluation

**Happy Coding! 🌳**
