-- Debug jobs table structure and data
-- This migration helps debug the job posting visibility issue

-- Check current jobs table structure
DO $$
BEGIN
    -- Create a test query to verify jobs table exists and has data
    RAISE NOTICE 'Checking jobs table...';
    
    -- Check if we have any jobs at all
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
        RAISE NOTICE 'Jobs table exists';
    ELSE
        RAISE NOTICE 'Jobs table does NOT exist';
    END IF;
    
    -- Check if we have any job_postings table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_postings') THEN
        RAISE NOTICE 'job_postings table exists';
    ELSE
        RAISE NOTICE 'job_postings table does NOT exist';
    END IF;
END $$;

-- Create a simple query log
INSERT INTO migration_log (migration_name, description, executed_at) 
VALUES ('006_debug_jobs_table.sql', 'Debug jobs table structure and data visibility', NOW())
ON CONFLICT (migration_name) DO NOTHING;