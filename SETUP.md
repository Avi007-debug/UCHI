# UCHI Setup Guide - Supabase Integration

Complete setup instructions for the Dynamic Urban Canopy Health Index (UCHI) application with Supabase backend.

---

## 📋 Prerequisites

- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Supabase Account** (free tier: [supabase.com](https://supabase.com))

---

## 🚀 Part 1: Supabase Configuration

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `UCHI`
   - **Database Password**: (create strong password)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for initialization

### Step 2: Create Database Tables

1. In Supabase Dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Image metadata table
CREATE TABLE image_metadata (
    id BIGSERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    area_type TEXT NOT NULL CHECK (area_type IN ('Bengaluru', 'RVCE')),
    sub_region TEXT,
    date DATE NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHI results table
CREATE TABLE chi_results (
    id BIGSERIAL PRIMARY KEY,
    image_id BIGINT REFERENCES image_metadata(id) ON DELETE CASCADE,
    area_type TEXT NOT NULL CHECK (area_type IN ('Bengaluru', 'RVCE')),
    sub_region TEXT,
    chi_value REAL NOT NULL CHECK (chi_value >= 0 AND chi_value <= 100),
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
CREATE INDEX idx_chi_results_created ON chi_results(created_at DESC);
```

4. Click **"Run"** (or press F5)
5. Verify: Go to **"Table Editor"** → should see `image_metadata` and `chi_results` tables

### Step 3: Create Storage Bucket

1. Click **"Storage"** (left sidebar)
2. Click **"New bucket"**
3. Enter:
   - **Name**: `uchi-images`
   - **Public bucket**: ✅ **Enable** (check the box)
4. Click **"Create bucket"**

### Step 4: Configure Storage Policies

1. Click on the **`uchi-images`** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"** → **"For full customization"**

**Policy 1 - Allow INSERT:**
```
Policy name: Allow public uploads
Target roles: public
Policy definition: (bucket_id = 'uchi-images'::text)
Allowed operations: ✅ INSERT
```

**Policy 2 - Allow SELECT:**
```
Policy name: Allow public reads
Target roles: public
Policy definition: (bucket_id = 'uchi-images'::text)
Allowed operations: ✅ SELECT
```

Click **"Save"** for each policy.

### Step 5: Get Credentials

1. Click **"Settings"** → **"API"** (left sidebar)
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## 🔧 Part 2: Backend Setup

### Step 1: Configure Environment

```powershell
cd C:\Coding\UCHI\backend
```

Create a file named **`.env`** with:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace `xxxxx` with your actual Supabase URL and paste your anon key.

**⚠️ IMPORTANT:** Make sure `.env` file is in the `backend/` folder!

### Step 2: Install Dependencies

```powershell
pip install Flask==3.0.0 flask-cors==4.0.0 python-dotenv==1.0.0 supabase==2.3.4
```

### Step 3: Verify Configuration

Run this test:

```powershell
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('URL:', os.getenv('SUPABASE_URL')); print('Key:', os.getenv('SUPABASE_KEY')[:20] + '...')"
```

You should see your URL and first 20 characters of your key.

### Step 4: Start Backend

```powershell
python app.py
```

**Expected output:**
```
✅ Supabase client initialized successfully
============================================================
Dynamic Urban Canopy Health Index (UCHI) Backend
============================================================
Database: Supabase PostgreSQL
Storage: Supabase Storage (bucket: uchi-images)
Server running on: http://localhost:5000
============================================================
```

**If you see warnings** `⚠️ WARNING: Supabase URL not configured!`:
- Check `.env` file exists in `backend/` folder
- Verify credentials are correct (no extra spaces)
- Restart the terminal and try again

### Step 5: Test Backend

Open a new terminal and test:

```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "database": true,
    "storage": true,
    "aiModule": false
  }
}
```

---

## 💻 Part 3: Frontend Setup

### Step 1: Verify API Configuration

Check that `frontend/src/services/apiConfig.ts` has:

```typescript
export const USE_MOCK_API = false; // Must be false for real backend
export const BACKEND_URL = 'http://localhost:5000';
```

### Step 2: Install Dependencies

```powershell
cd C:\Coding\UCHI\frontend
npm install
```

### Step 3: Start Frontend

```powershell
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 4: Open Application

Open http://localhost:5173 in your browser.

---

## ✅ Part 4: Verification

### Test 1: Upload Image

1. Click **"Upload Image"** in navigation
2. Select:
   - **Area Type**: RVCE
   - **Sub Region**: Campus
   - **Date**: Any recent date
3. Upload a sample image (.jpg or .png)
4. You should get a CHI result (65-80 range for Campus)

### Test 2: Check Supabase

**Storage:**
1. Go to Supabase Dashboard → **Storage** → **`uchi-images`**
2. You should see folder `RVCE/` with your uploaded image

**Database:**
1. Go to **Table Editor** → **`image_metadata`**
2. You should see a row with your filename
3. Go to **`chi_results`**
4. You should see a row with CHI value

### Test 3: View Results

1. Click **"Results"** in app navigation
2. Your uploaded image should appear with CHI value

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `⚠️ WARNING: Supabase URL not configured!`

**Solution:**
```powershell
# Check .env file exists
cd C:\Coding\UCHI\backend
Get-Content .env

# Should show:
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_KEY=eyJ...
```

If file doesn't exist, create it with your credentials.

---

**Problem:** `ModuleNotFoundError: No module named 'supabase'`

**Solution:**
```powershell
pip install supabase==2.3.4
```

---

**Problem:** `"database": false` in health check

**Solution:**
- Verify SQL schema was run in Supabase
- Check tables exist: Supabase → Table Editor
- Verify credentials in `.env` are correct

---

### Frontend Issues

**Problem:** Frontend shows mock data (dummy values)

**Solution:**
1. Open `frontend/src/services/apiConfig.ts`
2. Change: `export const USE_MOCK_API = false;`
3. Restart frontend: `npm run dev`

---

**Problem:** `Network Error` or `Failed to fetch`

**Solution:**
- Ensure backend is running (`python app.py`)
- Check backend URL: http://localhost:5000/health
- Verify CORS is enabled in backend (already configured)

---

**Problem:** Upload returns 500 error

**Solution:**
1. Check backend terminal for error message
2. Verify storage bucket `uchi-images` exists
3. Verify bucket policies allow INSERT
4. Check bucket is **public**

---

## 📊 Configuration Checklist

**Backend `.env` file:**
- [ ] File exists in `backend/` folder
- [ ] Contains `SUPABASE_URL=https://...`
- [ ] Contains `SUPABASE_KEY=eyJ...`
- [ ] No extra spaces or quotes

**Supabase Database:**
- [ ] Tables `image_metadata` and `chi_results` exist
- [ ] Indexes created successfully

**Supabase Storage:**
- [ ] Bucket `uchi-images` exists
- [ ] Bucket is **public**
- [ ] INSERT policy configured
- [ ] SELECT policy configured

**Frontend Configuration:**
- [ ] `USE_MOCK_API = false` in `apiConfig.ts`
- [ ] `BACKEND_URL = 'http://localhost:5000'`

**Services Running:**
- [ ] Backend: http://localhost:5000 responds
- [ ] Frontend: http://localhost:5173 loads

---

## 🎯 Quick Commands Reference

**Start Backend:**
```powershell
cd C:\Coding\UCHI\backend
python app.py
```

**Start Frontend:**
```powershell
cd C:\Coding\UCHI\frontend
npm run dev
```

**Test Backend:**
```powershell
curl http://localhost:5000/health
```

**Check Environment:**
```powershell
cd backend
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('SUPABASE_URL'))"
```

---

## 📚 Additional Documentation

- **AI Integration**: See `AI_INTEGRATION_GUIDE.md` (for implementing real CHI algorithms)
- **Backend API**: See `backend/README.md` (API endpoints documentation)
- **Project Overview**: See `README.md` (general project information)

---

## 🎉 Success!

If you've completed all steps and verification tests pass:

✅ **Supabase PostgreSQL** connected  
✅ **Supabase Storage** configured  
✅ **Backend API** running  
✅ **Frontend** connected to backend  
✅ **Image uploads** working  
✅ **CHI generation** functional (dummy values for now)  

**You're ready to develop and add real AI algorithms!** 🚀🌳

---

*Last Updated: January 1, 2026*  
*For support, check the troubleshooting section or review configuration.*
