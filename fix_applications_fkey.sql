-- Fix foreign key constraint for applications table
-- Drop the existing constraint
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_jobId_fkey;

-- Add new constraint pointing to job_postings table
ALTER TABLE applications ADD CONSTRAINT applications_jobId_fkey 
  FOREIGN KEY ("jobId") REFERENCES job_postings(id) ON DELETE CASCADE ON UPDATE CASCADE;