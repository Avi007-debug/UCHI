# UCHI Supabase Integration Guide

## 🗄️ Complete Database Setup & Integration

This guide walks through connecting your UCHI project to Supabase for production-ready data storage.

---

## 1. Supabase Account Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com/
2. Sign up / Login (free tier available)
3. Click **"New Project"**
4. Fill in details:
   - **Name:** `uchi-production`
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to users (e.g., Asia South - Mumbai)
5. Wait 2-3 minutes for project initialization

### Step 2: Get API Credentials

1. In Supabase dashboard, go to **Settings → API**
2. Copy these values:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 2. Database Schema Setup

### Step 1: Create Tables

In Supabase dashboard, go to **SQL Editor** and run:

```sql
-- ========================================
-- UCHI Database Schema
-- ========================================

-- 1. Image Metadata Table
CREATE TABLE public.image_metadata (
    id BIGSERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    area_type TEXT NOT NULL CHECK (area_type IN ('Bengaluru', 'RVCE')),
    sub_region TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_area_type ON public.image_metadata(area_type);
CREATE INDEX idx_image_date ON public.image_metadata(image_date);

-- 2. CHI Values Table
CREATE TABLE public.chi_values (
    id BIGSERIAL PRIMARY KEY,
    image_id BIGINT REFERENCES public.image_metadata(id) ON DELETE CASCADE,
    area_type TEXT NOT NULL,
    sub_region TEXT,
    chi_value DECIMAL(5,2) NOT NULL CHECK (chi_value >= 0 AND chi_value <= 100),
    category TEXT NOT NULL CHECK (category IN ('Excellent', 'Good', 'Moderate', 'Poor', 'Critical')),
    vegetation_percentage DECIMAL(5,2),
    interpretation TEXT,
    processing_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_chi_area ON public.chi_values(area_type);
CREATE INDEX idx_chi_date ON public.chi_values(processing_date);

-- 3. Processing Logs Table (for debugging)
CREATE TABLE public.processing_logs (
    id BIGSERIAL PRIMARY KEY,
    image_id BIGINT REFERENCES public.image_metadata(id),
    stage TEXT NOT NULL CHECK (stage IN ('preprocessing', 'vegetation_detection', 'chi_calculation')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'in_progress')),
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Temporal Analysis Cache (optional - for performance)
CREATE TABLE public.temporal_analysis (
    id BIGSERIAL PRIMARY KEY,
    region_name TEXT NOT NULL UNIQUE,
    chi_values JSONB NOT NULL,
    date_range DATERANGE NOT NULL,
    trend TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.image_metadata IS 'Stores metadata for all uploaded satellite images';
COMMENT ON TABLE public.chi_values IS 'Stores computed CHI values for each image';
COMMENT ON TABLE public.processing_logs IS 'Logs for CV pipeline processing stages';
COMMENT ON TABLE public.temporal_analysis IS 'Cached temporal analysis results';

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS
ALTER TABLE public.image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_logs ENABLE ROW LEVEL SECURITY;

-- Public read access (for frontend)
CREATE POLICY "Allow public read access on image_metadata"
    ON public.image_metadata FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on chi_values"
    ON public.chi_values FOR SELECT
    USING (true);

-- Authenticated write access (for backend)
CREATE POLICY "Allow authenticated insert on image_metadata"
    ON public.image_metadata FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on chi_values"
    ON public.chi_values FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ========================================
-- Helpful Views
-- ========================================

-- View: Latest CHI per region
CREATE OR REPLACE VIEW public.latest_chi_by_region AS
SELECT DISTINCT ON (area_type, sub_region)
    area_type,
    sub_region,
    chi_value,
    category,
    processing_date
FROM public.chi_values
ORDER BY area_type, sub_region, processing_date DESC;

-- View: Aggregate statistics
CREATE OR REPLACE VIEW public.chi_statistics AS
SELECT 
    area_type,
    COUNT(*) as total_measurements,
    ROUND(AVG(chi_value), 2) as avg_chi,
    ROUND(MIN(chi_value), 2) as min_chi,
    ROUND(MAX(chi_value), 2) as max_chi,
    ROUND(STDDEV(chi_value), 2) as stddev_chi
FROM public.chi_values
GROUP BY area_type;
```

### Step 2: Verify Tables

Run this query to check:
```sql
SELECT 
    tablename, 
    schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

Expected output:
```
image_metadata
chi_values
processing_logs
temporal_analysis
```

---

## 3. Storage Bucket Setup

### Step 1: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Name: `uchi-images`
4. Public bucket: **Yes** (for serving processed images)
5. Click **Create bucket**

### Step 2: Set Bucket Policies

Go to **Storage → uchi-images → Policies**:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uchi-images');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'uchi-images' 
    AND auth.role() = 'authenticated'
);
```

### Step 3: Create Folder Structure

In the bucket, create folders:
```
uchi-images/
├── bangalore/
│   ├── raw/
│   ├── processed/
│   └── vegetation_masks/
└── rvce/
    ├── sports_ground/
    ├── campus_buildings/
    ├── parking/
    └── hostel/
```

---

## 4. Backend Integration

### Step 1: Install Python Client

```bash
cd C:\Coding\UCHI\backend
pip install supabase
```

### Step 2: Create Environment File

**Create `.env` file in backend folder:**
```bash
cd C:\Coding\UCHI\backend
echo. > .env
```

**Edit `.env` and add:**
```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Use service_role key for backend operations
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Storage
STORAGE_BUCKET=uchi-images

# Flask
FLASK_ENV=development
```

**⚠️ IMPORTANT:** Add `.env` to `.gitignore`:
```bash
echo .env >> .gitignore
```

### Step 3: Update Supabase Client

**Edit `backend/supabase_client.py`:**
```python
"""
Supabase client configuration
Loads credentials from environment variables
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_supabase() -> Client:
    """
    Initialize and return Supabase client
    
    Returns:
        Supabase Client instance
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")  # Use service key for backend
    
    if not url or not key:
        raise ValueError(
            "Missing Supabase credentials. "
            "Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file"
        )
    
    return create_client(url, key)

# Create singleton instance
supabase_client = get_supabase()
```

### Step 4: Test Connection

**Create test script:**
```python
# backend/test_supabase.py
from supabase_client import get_supabase

def test_connection():
    """Test Supabase connection"""
    try:
        supabase = get_supabase()
        
        # Test database query
        response = supabase.table('chi_values').select("*").limit(1).execute()
        print("✅ Database connection successful!")
        print(f"   Tables accessible: {len(response.data)} rows returned")
        
        # Test storage
        buckets = supabase.storage.list_buckets()
        print(f"✅ Storage accessible!")
        print(f"   Buckets found: {[b.name for b in buckets]}")
        
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
```

**Run test:**
```bash
cd C:\Coding\UCHI\backend
python test_supabase.py
```

---

## 5. Update CV Pipeline with Database

### Step 1: Modify `run_cv_pipeline.py`

**Uncomment database integration sections:**
```python
# At the top
from database import Database

class CVPipeline:
    def __init__(self):
        self.db = Database()  # Enable database
        
    def process_region(self, region_name, image_paths, area_type, sub_region=None):
        """Process region with database storage"""
        
        for img_path in image_paths:
            # 1. Upload to Supabase Storage
            storage_path = self.upload_to_storage(img_path, area_type, sub_region)
            
            # 2. Insert metadata
            image_id = self.db.insert_image_metadata(
                filename=os.path.basename(img_path),
                storage_path=storage_path,
                area_type=area_type,
                sub_region=sub_region,
                date=datetime.now().strftime('%Y-%m-%d')
            )
            
            # 3. Process image
            processed = preprocessing.preprocess_image(img_path)
            veg_mask = vegetation_detection.detect_vegetation(processed)
            chi_value = chi_calculation.calculate_chi(veg_mask)
            
            # 4. Store CHI value
            self.db.insert_chi_value(
                image_id=image_id,
                area_type=area_type,
                sub_region=sub_region,
                chi_value=chi_value,
                category=self.get_category(chi_value),
                vegetation_percentage=self.calculate_veg_percentage(veg_mask)
            )
            
            print(f"✅ Processed and stored: {region_name} (CHI: {chi_value:.2f})")
    
    def upload_to_storage(self, local_path, area_type, sub_region):
        """Upload image to Supabase Storage"""
        filename = os.path.basename(local_path)
        storage_path = f"{area_type.lower()}/raw/{filename}"
        
        with open(local_path, 'rb') as f:
            self.db.supabase.storage.from_('uchi-images').upload(
                storage_path,
                f,
                file_options={"content-type": "image/jpeg"}
            )
        
        return storage_path
```

---

## 6. Update Backend API Endpoints

**Modify `backend/app.py` to fetch from database:**

```python
@app.route('/chi/bangalore', methods=['GET'])
def get_bangalore_chi():
    """Get latest Bengaluru CHI from database"""
    try:
        # Query latest CHI from database
        result = db.get_latest_chi('Bengaluru')
        
        if result:
            return jsonify({
                'chi': float(result['chi_value']),
                'category': result['category'],
                'interpretation': chi_gen.get_interpretation(result['category']),
                'areaType': 'Bengaluru',
                'lastUpdated': result['processing_date']
            }), 200
        else:
            # Fallback to hardcoded value if no data
            return jsonify({
                'chi': 62.5,
                'category': 'Good',
                'interpretation': chi_gen.get_interpretation('Good'),
                'areaType': 'Bengaluru'
            }), 200
    except Exception as e:
        print(f"Database error: {e}")
        # Return fallback value
        return jsonify({
            'chi': 62.5,
            'category': 'Good',
            'interpretation': chi_gen.get_interpretation('Good'),
            'areaType': 'Bengaluru'
        }), 200

# Add new endpoint for temporal data
@app.route('/temporal/<region>', methods=['GET'])
def get_temporal_data(region):
    """Get temporal CHI trends from database"""
    try:
        data = db.get_temporal_data(region)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

**Add method to `database.py`:**
```python
def get_latest_chi(self, area_type: str) -> Optional[Dict]:
    """Get latest CHI value for area"""
    try:
        response = self.supabase.table('latest_chi_by_region') \
            .select('*') \
            .eq('area_type', area_type) \
            .is_('sub_region', 'null') \
            .execute()
        
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error fetching CHI: {e}")
        return None

def get_temporal_data(self, region: str, days: int = 90) -> Dict:
    """Get temporal CHI data for trends"""
    try:
        from_date = (datetime.now() - timedelta(days=days)).isoformat()
        
        response = self.supabase.table('chi_values') \
            .select('chi_value, processing_date') \
            .eq('area_type', region) \
            .gte('processing_date', from_date) \
            .order('processing_date') \
            .execute()
        
        return {
            'region': region,
            'data': response.data,
            'count': len(response.data)
        }
    except Exception as e:
        print(f"Error fetching temporal data: {e}")
        return {'region': region, 'data': [], 'count': 0}
```

---

## 7. Insert Sample Data

**Run this to populate database with initial data:**

```python
# backend/scripts/populate_sample_data.py
from database import Database
from datetime import datetime, timedelta
import random

db = Database()

# Sample data for Bengaluru
for i in range(10):
    date = datetime.now() - timedelta(days=i*10)
    chi = 60 + random.uniform(-5, 10)
    
    # Insert metadata
    image_id = db.insert_image_metadata(
        filename=f"bangalore_sample_{i}.jpg",
        storage_path=f"bangalore/raw/sample_{i}.jpg",
        area_type="Bengaluru",
        sub_region=None,
        date=date.strftime('%Y-%m-%d')
    )
    
    # Insert CHI
    db.insert_chi_value(
        image_id=image_id,
        area_type="Bengaluru",
        sub_region=None,
        chi_value=round(chi, 2),
        category=db.get_chi_category(chi),
        vegetation_percentage=round(chi * 0.8, 2)
    )
    
    print(f"✅ Inserted Bengaluru data point {i+1}/10")

print("\n✅ Sample data inserted successfully!")
```

**Run:**
```bash
python scripts/populate_sample_data.py
```

---

## 8. Verify Integration

### Test Checklist

```bash
# 1. Test database connection
python backend/test_supabase.py

# 2. Insert sample data
python backend/scripts/populate_sample_data.py

# 3. Query data via API
curl http://localhost:5000/chi/bangalore

# 4. Check Supabase dashboard
# Go to: Table Editor → chi_values
# Should see your sample data

# 5. Test frontend
cd frontend
npm run dev
# Open: http://localhost:8080/dashboard
# Should display CHI from database
```

---

## 9. Production Deployment

### Environment Variables for Production

```env
# Production .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
STORAGE_BUCKET=uchi-images
FLASK_ENV=production
DATABASE_POOL_SIZE=10
```

### Security Best Practices

1. **Never commit `.env` to Git**
2. **Use service_role key only in backend** (not frontend)
3. **Enable RLS policies** on all tables
4. **Use HTTPS** for production backend
5. **Rotate keys** every 6 months

---

## 10. Monitoring & Maintenance

### Check Database Health

```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check recent CHI values
SELECT 
    area_type,
    chi_value,
    category,
    processing_date
FROM chi_values
ORDER BY processing_date DESC
LIMIT 10;

-- Check error logs
SELECT 
    stage,
    status,
    error_message,
    created_at
FROM processing_logs
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🎉 Integration Complete!

Your UCHI project is now connected to Supabase with:
- ✅ Database schema for CHI values
- ✅ Storage bucket for images
- ✅ Backend API integration
- ✅ Sample data populated
- ✅ Frontend displaying live data

**Next:** Run the full pipeline and watch data flow from satellite images → CV processing → Supabase → Dashboard!
