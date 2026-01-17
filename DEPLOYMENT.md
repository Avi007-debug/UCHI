# UCHI Deployment Guide

## Deployment Strategy

**✅ Recommended: Static Deployment (No Backend Required)**

Your UCHI project uses **pre-computed CHI results** stored in JSON files. The frontend is configured to work as a fully static site without needing a live backend.

---

## 🚀 Vercel Deployment (Static)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Git repository for your project

### Step 1: Push to GitHub

```powershell
cd C:\Coding\UCHI
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**

**Option B: Vercel CLI**

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd C:\Coding\UCHI\frontend

# Deploy
vercel
```

Follow the prompts:
- Link to existing project? **No**
- Project name? **uchi** (or your choice)
- Which directory is your code located? **.**
- Want to modify settings? **No**

### Step 3: Configure Environment (Optional)

If you need environment variables:

```powershell
# Set production environment variable
vercel env add VITE_APP_TITLE production
# Enter: "UCHI - Urban Cooling Heat Index"
```

---

## 📊 How It Works (Static Mode)

### Data Flow
```
User → Vercel (Static Site)
         ↓
      /data/chi_results.json (pre-computed)
         ↓
      Display visualizations
```

### What's Included
- ✅ Pre-computed CHI scores for Bengaluru, RVCE, Cubbon Park
- ✅ GeoJSON map data
- ✅ Interactive visualizations
- ✅ All charts and comparisons
- ❌ Live image upload (requires backend)

### Files Deployed
```
frontend/
  public/
    data/chi_results.json         ← Pre-computed results
    geojson/
      bangalore.geojson            ← Map boundaries
      rvce.geojson
      cubbon.geojson
  src/
    services/
      mockApi.ts                   ← Loads static data
      apiConfig.ts                 ← USE_MOCK_API = true
```

---

## 🔄 Updating CHI Data

### When You Run the Pipeline

1. **Run backend pipeline locally:**
   ```powershell
   cd C:\Coding\UCHI\backend
   python run_cv_pipeline.py
   ```

2. **Copy updated results:**
   ```powershell
   copy chi_results.json ..\frontend\public\data\chi_results.json
   ```

3. **Commit and push:**
   ```powershell
   cd ..
   git add frontend/public/data/chi_results.json
   git commit -m "Update CHI results - $(Get-Date -Format 'yyyy-MM-dd')"
   git push
   ```

4. **Vercel auto-deploys** on push (takes ~2 minutes)

---

## 🐍 Alternative: Deploy Backend (If Needed)

### When You Need Backend
- Live image upload functionality
- Real-time processing
- API for external integrations

### Backend Deployment Options

#### Option 1: Railway (Recommended for Python)
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd C:\Coding\UCHI\backend
railway login
railway init
railway up
```

Configure in Railway dashboard:
- **Start Command**: `python app.py`
- **Environment Variables**: Add your `.env` variables

#### Option 2: Render
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

#### Option 3: Vercel Serverless (Limited)
- Vercel supports Python but with 50MB limit
- Only for lightweight endpoints
- Not suitable for image processing

### Update Frontend for Backend
If you deploy the backend, update frontend:

```typescript
// frontend/src/services/apiConfig.ts
export const USE_MOCK_API = false;
export const BACKEND_URL = 'https://your-backend.railway.app'; // or Render URL
```

---

## 🧪 Testing Deployment

### Local Preview
```powershell
cd C:\Coding\UCHI\frontend
npm run build
npm run preview
```
Visit: http://localhost:4173

### Production Checks
After deploying to Vercel:
1. ✅ Homepage loads
2. ✅ Dashboard shows CHI data
3. ✅ Maps render with boundaries
4. ✅ Charts display correctly
5. ✅ Compare page works

---

## 📝 Cost Analysis

### Static Deployment (Recommended)
- **Vercel Free Tier**
  - ✅ 100GB bandwidth/month
  - ✅ Unlimited static requests
  - ✅ Automatic HTTPS
  - ✅ Custom domain
  - **Cost**: $0

### With Backend
- **Railway**
  - ✅ 500 hours/month free
  - ✅ $5/month starter
- **Render**
  - ✅ Free tier available
  - ✅ Spins down after 15min inactivity

---

## 🔧 Troubleshooting

### Build Fails
```powershell
# Check Node version
node --version  # Should be >= 18

# Clear cache and rebuild
cd C:\Coding\UCHI\frontend
rm -r node_modules
rm bun.lockb
npm install
npm run build
```

### Data Not Loading
- Check browser console for errors
- Verify `/data/chi_results.json` exists in `public/`
- Ensure `USE_MOCK_API = true` in `apiConfig.ts`

### Maps Not Showing
- Verify GeoJSON files in `public/geojson/`
- Check console for fetch errors
- Ensure proper CORS configuration

---

## 📋 Deployment Checklist

- [ ] Static data files copied to `frontend/public/data/`
- [ ] `USE_MOCK_API` set to `true` in apiConfig.ts
- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Build succeeds on Vercel
- [ ] Production URL works correctly
- [ ] All pages accessible
- [ ] CHI data displays correctly
- [ ] Maps render properly
- [ ] Custom domain configured (optional)

---

## 🎯 Recommended Workflow

### For Static Dashboard (No Uploads)
```
Run pipeline locally → Update JSON → Push to GitHub → Auto-deploy
```

### For Full Application (With Uploads)
```
Deploy backend (Railway/Render) → Update frontend API URL → Deploy frontend (Vercel)
```

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Railway Dashboard](https://railway.app/dashboard)
- [Render Dashboard](https://dashboard.render.com/)
- [Vercel Docs](https://vercel.com/docs)

---

## 🆘 Support

If deployment fails:
1. Check Vercel build logs
2. Test build locally: `npm run build`
3. Verify all environment variables
4. Check file paths are correct

---

**Last Updated**: January 17, 2026
**Version**: 1.0
