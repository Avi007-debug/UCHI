# UCHI Quick Start Guide

## Problem: Dashboard Shows White Screen

### Root Cause
The white screen occurs when:
1. **Backend is not running** - Frontend can't fetch CHI data
2. **CORS issues** - Browser blocks API requests
3. **GeoJSON files missing** - Map can't render

---

## ✅ Solution: Start Both Servers

### Step 1: Start Backend (Terminal 1)
```bash
cd C:\Coding\UCHI\backend
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Restarting with stat
 * Debugger is active!
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd C:\Coding\UCHI\frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.4.19  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Step 3: Test Connection
1. Open browser to http://localhost:8080/dashboard
2. **OR** Open `C:\Coding\UCHI\test_connection.html` in browser
3. Click "Run Connection Tests" button
4. All tests should show ✅ green checkmarks

---

## 🔍 Troubleshooting

### Issue: Backend won't start
**Error:** `ModuleNotFoundError: No module named 'flask_cors'`

**Fix:**
```bash
cd C:\Coding\UCHI\backend
pip install -r requirements.txt
```

### Issue: Frontend shows "Connection Error"
**Symptoms:**
- Red error card on dashboard
- Message: "Failed to connect to backend"

**Fix:**
1. Check backend terminal - must show "Running on http://127.0.0.1:5000"
2. Open `test_connection.html` to verify all endpoints return data
3. Check browser console (F12) for CORS errors

### Issue: Map not rendering
**Symptoms:**
- "Loading map..." spinner stuck
- "Failed to load map data" error

**Fix:**
1. Verify files exist:
   - `C:\Coding\UCHI\frontend\public\geojson\bangalore.geojson`
   - `C:\Coding\UCHI\frontend\public\geojson\rvce.geojson`
2. Check browser console for 404 errors
3. Clear browser cache and refresh

---

## 🎯 Expected Behavior

### When Everything Works:
1. Dashboard loads within 2 seconds
2. Two tabs visible: "Bengaluru" and "RVCE"
3. Map shows colored polygons (not white rectangles)
4. CHI values display:
   - Bengaluru: **62.5** (Good - Yellow)
   - RVCE: **71.3** (Good - Yellow)
5. Browser console shows:
   ```
   🔌 API Mode: REAL
   📍 Backend URL: http://localhost:5000
   Fetching CHI data from backend...
   Bengaluru CHI: {chi: 62.5, category: "Good", ...}
   RVCE CHI: {chi: 71.3, category: "Good", ...}
   Loading GeoJSON files...
   Bangalore GeoJSON loaded: {...}
   RVCE GeoJSON loaded: {...}
   Rendering map for area: Bengaluru
   ```

---

## 📝 Quick Checklist

Before reporting issues, verify:
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:8080
- [ ] Both GeoJSON files exist in `frontend/public/geojson/`
- [ ] Browser console shows no red errors
- [ ] test_connection.html shows all ✅ green tests

---

## 🚀 Production Deployment

For production (not localhost):

1. Update backend URL in `frontend/src/services/apiConfig.ts`:
   ```typescript
   export const BACKEND_URL = 'https://your-backend-domain.com';
   ```

2. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

3. Deploy `dist/` folder to web server

4. Deploy backend with proper CORS configuration

---

## 📞 Need Help?

1. Open `test_connection.html` in browser
2. Click "Run Connection Tests"
3. Screenshot the results
4. Check browser console (F12) for errors
5. Share terminal output from both backend and frontend
