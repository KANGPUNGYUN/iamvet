-- Migration: Drop job_postings table
-- Date: 2025-09-19
-- Description: Remove deprecated job_postings table as all functionality has been moved to jobs table

-- Drop job_postings table if it exists
DROP TABLE IF EXISTS job_postings CASCADE;

-- Log the migration
INSERT INTO migration_log (migration_name, executed_at, description) 
VALUES (
  '001_drop_job_postings_table', 
  NOW(), 
  'Dropped deprecated job_postings table'
) ON CONFLICT (migration_name) DO NOTHING;