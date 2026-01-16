-- ============================================================
-- PRE-MIGRATION CHECK: Run this FIRST to see current data
-- ============================================================
-- This tells you which UPDATE logic to use

SELECT 'Current chi_results data:' AS info;
SELECT DISTINCT area_type FROM chi_results;

SELECT 'Current image_metadata data:' AS info;
SELECT DISTINCT area_type FROM image_metadata;

-- ============================================================
-- Expected Results:
-- ============================================================
-- If you see: 'Bengaluru', 'RVCE'
--   → Use: UPDATE ... WHERE area_type = 'Bengaluru'
--
-- If you see: 'city', 'campus' 
--   → Skip the UPDATE statements (already migrated)
--
-- If you see: Nothing (empty table)
--   → Skip the UPDATE statements (no data to migrate)
-- ============================================================
