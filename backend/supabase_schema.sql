-- ============================================================
-- UCHI Database Schema for Supabase PostgreSQL
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Table: image_metadata
-- Stores metadata about uploaded images
CREATE TABLE IF NOT EXISTS image_metadata (
    id BIGSERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    area_type TEXT NOT NULL CHECK (area_type IN ('Bengaluru', 'RVCE')),
    sub_region TEXT,
    date DATE NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: chi_results
-- Stores CHI calculation results
CREATE TABLE IF NOT EXISTS chi_results (
    id BIGSERIAL PRIMARY KEY,
    image_id BIGINT REFERENCES image_metadata(id) ON DELETE CASCADE,
    area_type TEXT NOT NULL CHECK (area_type IN ('Bengaluru', 'RVCE')),
    sub_region TEXT,
    chi_value REAL NOT NULL CHECK (chi_value >= 0 AND chi_value <= 100),
    status TEXT NOT NULL CHECK (status IN ('Excellent', 'Good', 'Moderate', 'Poor', 'Critical')),
    interpretation TEXT NOT NULL,
    date DATE NOT NULL,
    vegetation_coverage REAL,
    healthy_vegetation REAL,
    stressed_vegetation REAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chi_results_area_type ON chi_results(area_type);
CREATE INDEX IF NOT EXISTS idx_chi_results_sub_region ON chi_results(sub_region);
CREATE INDEX IF NOT EXISTS idx_chi_results_date ON chi_results(date DESC);
CREATE INDEX IF NOT EXISTS idx_chi_results_created_at ON chi_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_image_metadata_area_type ON image_metadata(area_type);

-- Comments for documentation
COMMENT ON TABLE image_metadata IS 'Stores metadata for uploaded satellite/aerial images';
COMMENT ON TABLE chi_results IS 'Stores computed Canopy Health Index results';
COMMENT ON COLUMN chi_results.chi_value IS 'Canopy Health Index value (0-100)';
COMMENT ON COLUMN chi_results.vegetation_coverage IS 'Percentage of area covered by vegetation';
COMMENT ON COLUMN chi_results.healthy_vegetation IS 'Percentage of healthy vegetation';
COMMENT ON COLUMN chi_results.stressed_vegetation IS 'Percentage of stressed/unhealthy vegetation';

-- ============================================================
-- After running this SQL:
-- 1. Go to Table Editor to verify tables were created
-- 2. Go to Storage → New bucket → name: 'uchi-images' (make it PUBLIC)
-- 3. Storage → Policies → Add INSERT and SELECT policies for public access
-- ============================================================
