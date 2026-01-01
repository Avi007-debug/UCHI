# 🚀 Quick Setup Instructions

## Step 1: Update Your `.env` File

Edit `backend/.env` and add BOTH keys:

```env
SUPABASE_URL=https://niswgdljrgsjhpgblfjj.supabase.co

# Service Role Key (backend uses this - keep secret!)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc3dnZGxqcmdzamhwZ2JsZmpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI4NDg3MiwiZXhwIjoyMDgyODYwODcyfQ.DZRU9H9S4yWpewZUXZylz70PTZVLM5-foEmDnv77Drk

# Anon/Public Key (get from Supabase Dashboard → Settings → API)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_anon_public_key_here
```

**Where to find keys:**
- Go to Supabase Dashboard → Settings → API
- Copy **service_role** key (for backend)
- Copy **anon public** key (optional, for frontend direct access)

---

## Step 2: Run SQL Schema in Supabase

1. Open Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy contents from `backend/supabase_schema.sql`
4. Click **Run** (or F5)
5. Verify: Go to **Table Editor** → should see `image_metadata` and `chi_results`

---

## Step 3: Create Storage Bucket

1. Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Name: `uchi-images`
4. ✅ Make it **Public**
5. Click **Policies** tab → Add policies:
   - **INSERT policy**: Allow public uploads (for development)
   - **SELECT policy**: Allow public reads

---

## Step 4: Install Dependencies & Test

```powershell
cd backend
pip uninstall supabase -y
pip install supabase==2.0.0
python verify_config.py
```

Expected output:
```
✅ Supabase client created successfully
✅ Database connection successful
✅ Storage bucket 'uchi-images' exists
```

---

## Step 5: Start Backend

```powershell
python app.py
```

Expected:
```
✅ Supabase client initialized successfully
Server running on: http://localhost:5000
```

---

## Step 6: Start Frontend

```powershell
cd ..\frontend
npm run dev
```

Frontend should connect to backend at http://localhost:5173

---

## ✅ Verification

**Frontend is properly mapped:**
- ✅ `USE_MOCK_API = false` in `frontend/src/services/apiConfig.ts`
- ✅ `BACKEND_URL = 'http://localhost:5000'`
- ✅ Frontend calls YOUR backend (not Supabase directly)

**Backend properly configured:**
- ✅ Uses `SUPABASE_SERVICE_KEY` (full privileges)
- ✅ Connects to Supabase PostgreSQL
- ✅ Uploads images to Supabase Storage

---

## 🎯 Quick Test

1. Open http://localhost:5173
2. Click "Upload Image"
3. Select RVCE → Campus
4. Upload a test image
5. Should get CHI result (65-80 range)
6. Check Supabase Dashboard:
   - Storage → `uchi-images` → image uploaded
   - Table Editor → `chi_results` → new row

**Done!** 🎉
