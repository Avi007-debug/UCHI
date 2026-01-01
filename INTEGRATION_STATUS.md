# ✅ UCHI Supabase Integration - Summary

## What Was Done

Successfully integrated **Supabase** (PostgreSQL + Storage) into the UCHI project, replacing local SQLite and file storage with a cloud-native architecture.

---

## 📁 Current Project Structure

```
UCHI/
├── SETUP.md                      ⭐ MAIN SETUP GUIDE (use this!)
├── README.md                     Project overview
├── backend/
│   ├── .env.example              Template for environment variables
│   ├── app.py                    Flask app (uses Supabase Storage)
│   ├── config.py                 Config (loads Supabase from .env)
│   ├── supabase_client.py        Supabase connection manager
│   ├── database.py               PostgreSQL queries (Supabase)
│   ├── chi_generator.py          Dummy CHI generation
│   ├── requirements.txt          Python dependencies
│   ├── verify_config.py          ⭐ Run this to test setup
│   └── install.ps1               Windows installation helper
└── frontend/
    └── src/services/
        └── apiConfig.ts          ⭐ CHECK: USE_MOCK_API = false
```

---

## ⚙️ Required Configuration

### 1. Backend Environment Variables

**File:** `backend/.env` (you must create this!)

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get credentials from: **Supabase Dashboard → Settings → API**

### 2. Frontend API Configuration

**File:** `frontend/src/services/apiConfig.ts`

```typescript
export const USE_MOCK_API = false; // ✅ Must be false
export const BACKEND_URL = 'http://localhost:5000';
```

### 3. Supabase Database Setup

**Run this SQL** in Supabase SQL Editor:

```sql
-- Tables
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

CREATE TABLE chi_results (
    id BIGSERIAL PRIMARY KEY,
    image_id BIGINT REFERENCES image_metadata(id),
    area_type TEXT NOT NULL,
    chi_value REAL NOT NULL,
    status TEXT NOT NULL,
    interpretation TEXT NOT NULL,
    date DATE NOT NULL,
    vegetation_coverage REAL,
    healthy_vegetation REAL,
    stressed_vegetation REAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chi_results_area ON chi_results(area_type);
CREATE INDEX idx_chi_results_date ON chi_results(date DESC);
```

### 4. Supabase Storage Setup

1. Go to **Storage** in Supabase
2. Create bucket: `uchi-images`
3. Make it **public** ✅
4. Add policies:
   - INSERT policy (allow uploads)
   - SELECT policy (allow reads)

---

## 🚀 How to Run

### Verify Configuration First

```powershell
cd backend
python verify_config.py
```

This checks:
- ✅ .env file exists
- ✅ Supabase credentials loaded
- ✅ Dependencies installed
- ✅ Supabase connection works
- ✅ Storage bucket exists

### Start Backend

```powershell
cd backend
python app.py
```

Expected output:
```
✅ Supabase client initialized successfully
============================================================
Database: Supabase PostgreSQL
Storage: Supabase Storage (bucket: uchi-images)
Server running on: http://localhost:5000
============================================================
```

### Start Frontend

```powershell
cd frontend
npm run dev
```

---

## 🔍 Verification Checklist

**Backend Configuration:**
- [ ] `.env` file exists in `backend/` folder
- [ ] `SUPABASE_URL` set correctly in `.env`
- [ ] `SUPABASE_KEY` set correctly in `.env`
- [ ] `python verify_config.py` passes all checks
- [ ] Backend starts without warnings

**Supabase Setup:**
- [ ] Tables `image_metadata` and `chi_results` exist
- [ ] Storage bucket `uchi-images` exists
- [ ] Bucket is **public**
- [ ] INSERT and SELECT policies configured

**Frontend Configuration:**
- [ ] `USE_MOCK_API = false` in `apiConfig.ts`
- [ ] `BACKEND_URL = 'http://localhost:5000'`

**Running Services:**
- [ ] Backend responds at http://localhost:5000/health
- [ ] Frontend loads at http://localhost:5173
- [ ] Can upload image successfully
- [ ] Image appears in Supabase Storage
- [ ] Data appears in Supabase tables

---

## 🐛 Common Issues

### Issue: Backend shows Supabase warnings

**Symptoms:**
```
⚠️ WARNING: Supabase URL not configured!
```

**Fix:**
1. Create `backend/.env` file
2. Add your Supabase credentials
3. Restart backend

---

### Issue: Upload fails with 500 error

**Symptoms:** Upload button doesn't work, 500 error in browser console

**Fix:**
1. Check bucket `uchi-images` exists
2. Verify bucket is **public**
3. Check storage policies are configured
4. Look at backend terminal for error details

---

### Issue: Frontend shows mock/dummy data

**Symptoms:** Data doesn't match uploads, always same values

**Fix:**
1. Open `frontend/src/services/apiConfig.ts`
2. Change `USE_MOCK_API` to `false`
3. Restart frontend (`npm run dev`)

---

## 📚 Documentation

- **SETUP.md** - Complete installation guide (use this!)
- **README.md** - Project overview
- **backend/verify_config.py** - Configuration verification script

---

## ✅ What's Working Now

- ✅ Supabase PostgreSQL database
- ✅ Supabase Storage for images
- ✅ Backend API with cloud integration
- ✅ Frontend connected to real backend
- ✅ Image upload to cloud
- ✅ Dummy CHI generation (region-based)
- ✅ Results display
- ✅ Temporal comparison

## 🔜 Next Steps (Optional)

- [ ] Add real AI processing (see `AI_INTEGRATION_GUIDE.md`)
- [ ] Deploy to production
- [ ] Add user authentication

---

**🎉 Setup complete! Start with `python verify_config.py` to test your configuration.**
