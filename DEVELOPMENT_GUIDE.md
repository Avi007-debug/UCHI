# UCHI Development Guide

## 🎓 Academic Project Context

This is a **college-level project** demonstrating:
- Full-stack web development
- REST API design
- Database management
- Future AI/ML integration readiness
- Professional code organization

## 📋 Project Requirements Checklist

### Backend Requirements ✅
- [x] Python Flask framework
- [x] SQLite database
- [x] Health check endpoint (`/health`)
- [x] Image upload API (`/upload-image`)
- [x] Dummy CHI generation with region-specific ranges
- [x] Results retrieval endpoints
- [x] Temporal comparison API
- [x] AI placeholder modules (preprocessing, vegetation_detection, chi_calculation)
- [x] Clean folder structure
- [x] Comprehensive comments

### Frontend Requirements ✅
- [x] Modern React + TypeScript
- [x] Landing page with project overview
- [x] Study area selection (Bengaluru/RVCE)
- [x] Image upload UI with drag-and-drop
- [x] CHI display with color-coded status
- [x] RVCE comparison view with table/chart
- [x] Temporal comparison view
- [x] Error handling
- [x] Loading indicators
- [x] Responsive design

### Architecture Requirements ✅
- [x] Clean separation of frontend and backend
- [x] Modular code structure
- [x] RESTful API design
- [x] Easy future AI integration
- [x] Production-ready patterns

## 🏗️ How to Present This Project

### For Evaluation/Demo

1. **Start Backend**
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Demo Flow**
   - Landing page → Study area selection → Image upload → Results display → Comparison

### Highlights for Evaluators

1. **Full-Stack Implementation**
   - React frontend communicates with Flask backend via REST APIs
   - Complete CRUD operations
   - Real database integration

2. **Production Patterns**
   - Environment configuration
   - Error handling
   - API abstraction layer
   - TypeScript for type safety
   - Modular component architecture

3. **AI-Ready Architecture**
   - Placeholder modules with detailed comments
   - Clear integration points
   - Realistic dummy data generation
   - Scalable design

4. **Professional Features**
   - Mock/Real API switching
   - Loading states
   - Toast notifications
   - Responsive design
   - Data visualization

## 🔧 Development Workflow

### Adding a New Feature

1. **Define Types** (if needed)
   ```typescript
   // src/types/uchi.ts
   export interface NewFeature {
     // ...
   }
   ```

2. **Create Backend API**
   ```python
   # backend/app.py
   @app.route('/new-endpoint', methods=['GET'])
   def new_endpoint():
       # ...
   ```

3. **Create Frontend Service**
   ```typescript
   // src/services/realApi.ts
   export const newFeatureApi = async () => {
       // ...
   };
   ```

4. **Create Component**
   ```tsx
   // src/components/feature/NewComponent.tsx
   ```

5. **Add Route** (if needed)
   ```tsx
   // src/App.tsx
   <Route path="/new-feature" element={<NewFeature />} />
   ```

### Switching Between Mock and Real API

```typescript
// src/services/apiConfig.ts
export const USE_MOCK_API = false; // Change to false for real backend
```

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Upload Bengaluru image → Check CHI in range 55-70
- [ ] Upload RVCE image → Check CHI matches sub-region range
- [ ] View Results page → Check all data displays
- [ ] Compare regions → Check temporal comparison works
- [ ] Test error cases (no file, invalid region)
- [ ] Check responsive design on mobile

### Automated Testing (Future)
```bash
# Backend
pytest backend/tests/

# Frontend
npm run test
```

## 📊 Data Flow

```
User uploads image
    ↓
Frontend validates
    ↓
POST /upload-image
    ↓
Backend saves file & metadata
    ↓
[Future: Image → Preprocessing → Vegetation Detection → CHI Calculation]
Currently: Generate dummy CHI
    ↓
Store result in database
    ↓
Return CHI result
    ↓
Frontend displays result
```

## 🎨 UI/UX Guidelines

### Color Scheme
- **Primary (Green)**: Nature theme
- **Success**: Good CHI status
- **Warning**: Moderate status
- **Error**: Poor/Critical status

### Component Usage
```tsx
// Cards for sections
<Card className="gradient-card">

// Buttons with nature theme
<Button variant="nature">

// CHI status display
<CHIDisplay value={chi} status={status} />

// Region table
<RegionTable data={regions} />

// Comparison card
<TemporalComparisonCard comparison={data} />
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Update backend URL in production:
   ```typescript
   // frontend/src/services/apiConfig.ts
   export const BACKEND_URL = 'https://your-backend-domain.com';
   ```

2. Build:
   ```bash
   cd frontend
   npm run build
   ```

3. Deploy `frontend/dist/` folder

### Backend Deployment (Heroku/PythonAnywhere/Railway)

1. Add `Procfile`:
   ```
   web: python app.py
   ```

2. Update CORS settings:
   ```python
   CORS(app, resources={r"/*": {"origins": "https://your-frontend.com"}})
   ```

3. Use environment variables for configuration

## 🔐 Security Considerations

### Current State (Development)
- CORS open to all origins
- No authentication
- Files stored locally

### Production Recommendations
- Restrict CORS to specific domain
- Add user authentication
- Use cloud storage (S3, Cloudinary)
- Add rate limiting
- Validate file types and sizes server-side
- Sanitize database inputs

## 📈 Performance Optimization

### Frontend
- Lazy load routes
- Optimize images
- Minimize bundle size
- Use React.memo for expensive components

### Backend
- Add database indexes
- Implement caching (Redis)
- Use connection pooling
- Optimize image processing pipeline

## 🐛 Common Issues & Solutions

### Issue: Frontend can't connect to backend
**Solution**: Check CORS is enabled and backend is running on correct port

### Issue: Database locked error
**Solution**: Close all connections properly, use connection pooling

### Issue: Large images timeout
**Solution**: Implement async processing with job queue (Celery)

### Issue: Inconsistent CHI values
**Solution**: When AI is integrated, calibrate models with ground truth

## 📚 Learning Resources

### Frontend
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [shadcn/ui Components](https://ui.shadcn.com)

### Backend
- [Flask Documentation](https://flask.palletsprojects.com)
- [SQLite Tutorial](https://www.sqlitetutorial.net)

### AI/ML (Future)
- [TensorFlow Tutorials](https://www.tensorflow.org/tutorials)
- [U-Net Paper](https://arxiv.org/abs/1505.04597)
- [NDVI Explanation](https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index)

## 🎯 Project Milestones

- ✅ **Milestone 1**: Frontend UI complete
- ✅ **Milestone 2**: Backend API complete
- ✅ **Milestone 3**: Database integration
- ✅ **Milestone 4**: Mock data working
- ⏳ **Milestone 5**: AI model training
- ⏳ **Milestone 6**: AI integration
- ⏳ **Milestone 7**: Production deployment

---

**Happy Coding! 🌳**
