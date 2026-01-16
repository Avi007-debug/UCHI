# Quick Start Guide - UCHI Dashboard

## Prerequisites
- Python 3.8+ (for backend)
- Node.js 18+ or Bun (for frontend)

## Step 1: Start Backend

```bash
cd C:\Coding\UCHI\backend
python app.py
```

Expected output:
```
============================================================
Dynamic Urban Canopy Health Index (UCHI) Backend
============================================================
Database: Supabase PostgreSQL
Storage: Supabase Storage (bucket: uchi-images)
Server running on: http://localhost:5000
============================================================
```

## Step 2: Start Frontend

Open a new terminal:

```bash
cd C:\Coding\UCHI\frontend
npm install  # First time only
npm run dev
```

Or with Bun:
```bash
cd C:\Coding\UCHI\frontend
bun install  # First time only
bun dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 3: Open Dashboard

Open browser and navigate to:
```
http://localhost:5173/dashboard
```

## What You Should See

### Dashboard Page
1. **Header**: "Urban Canopy Health Index Dashboard"
2. **Toggle Tabs**: 
   - "Bengaluru (City Overview)"
   - "RVCE (Campus Overview)"
3. **Map View**: Canvas-based visualization
4. **Information Panel**: 
   - CHI value (0-100 scale)
   - Health category
   - Detailed interpretation

### Bengaluru View
- Map shows city boundary filled with yellow (CHI: 62.5)
- RVCE appears as small green sub-region (CHI: 71.3)
- Both values visible in legend

### RVCE View
- Map zooms to campus
- Shows campus sub-regions with dotted lines
- Green color for campus (CHI: 71.3)

## Testing the API

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Get Bengaluru CHI
curl http://localhost:5000/chi/bangalore

# Get RVCE CHI
curl http://localhost:5000/chi/rvce

# Get Bengaluru geometry
curl http://localhost:5000/geometry/bangalore

# Get RVCE geometry
curl http://localhost:5000/geometry/rvce
```

## Troubleshooting

### Backend Won't Start
- Check if port 5000 is available
- Ensure Python dependencies are installed: `pip install -r requirements.txt`
- Check if `.env` file exists with Supabase credentials

### Frontend Won't Start
- Delete `node_modules` and reinstall: `npm install`
- Clear cache: `npm cache clean --force`
- Check if port 5173 is available

### "Cannot fetch data" Error
- Make sure backend is running on port 5000
- Check `frontend/src/services/apiConfig.ts`:
  ```typescript
  export const USE_MOCK_API = false;  // Set to true for demo without backend
  export const BACKEND_URL = 'http://localhost:5000';
  ```

### Map Not Displaying
- Check browser console for errors
- Ensure MapView.tsx is properly imported
- Try refreshing the page

## Demo Mode (Without Backend)

To run frontend without backend:

1. Edit `frontend/src/services/apiConfig.ts`:
   ```typescript
   export const USE_MOCK_API = true;
   ```

2. Start frontend only:
   ```bash
   cd frontend
   npm run dev
   ```

3. Dashboard will use mock data (same CHI values)

## Features to Test

✅ Toggle between Bengaluru and RVCE views
✅ Map color changes based on CHI values
✅ Information panel updates when switching views
✅ Color legend is visible and accurate
✅ Navigation works (Home → Dashboard)
✅ Responsive design (test on mobile/tablet sizes)

## Expected CHI Values

| Region | CHI | Category | Color |
|--------|-----|----------|-------|
| Bengaluru | 62.5 | Good | Yellow |
| RVCE | 71.3 | Good | Green |

## Next Steps

To make the system production-ready:

1. **Replace hardcoded CHI values** with database queries
2. **Load real GeoJSON** boundary files
3. **Add authentication** if needed
4. **Deploy backend** to cloud (Heroku, AWS, etc.)
5. **Deploy frontend** to Vercel/Netlify
6. **Add real-time updates** via WebSocket (optional)

## Support

For issues, check:
- Backend logs in terminal
- Browser console (F12)
- Network tab in DevTools
- [MODIFICATION_SUMMARY.md](MODIFICATION_SUMMARY.md) for detailed changes
