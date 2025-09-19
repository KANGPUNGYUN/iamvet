-- Migration: Ensure jobs table has correct structure
-- Date: 2025-09-19
-- Description: Verify and update jobs table structure to match application requirements

-- Ensure jobs table exists with correct structure
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  "hospitalId" TEXT NOT NULL,
  title TEXT NOT NULL,
  "workType" TEXT[] DEFAULT '{}',
  "isUnlimitedRecruit" BOOLEAN DEFAULT false,
  "recruitEndDate" TIMESTAMP,
  major TEXT[] DEFAULT '{}',
  experience TEXT[] DEFAULT '{}',
  position TEXT,
  "salaryType" TEXT,
  salary TEXT,
  "workDays" TEXT[] DEFAULT '{}',
  "isWorkDaysNegotiable" BOOLEAN DEFAULT false,
  "workStartTime" TEXT,
  "workEndTime" TEXT,
  "isWorkTimeNegotiable" BOOLEAN DEFAULT false,
  benefits TEXT,
  education TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  "experienceDetails" TEXT[] DEFAULT '{}',
  preferences TEXT[] DEFAULT '{}',
  "managerName" TEXT,
  "managerPhone" TEXT,
  "managerEmail" TEXT,
  department TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "isDraft" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "deletedAt" TIMESTAMP,
  userid TEXT -- Legacy field for compatibility
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_hospital_id ON jobs("hospitalId");
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs("isActive");
CREATE INDEX IF NOT EXISTS idx_jobs_is_draft ON jobs("isDraft");
CREATE INDEX IF NOT EXISTS idx_jobs_deleted_at ON jobs("deletedAt");
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs("createdAt");

-- Ensure applications table exists with correct structure
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL,
  "veterinarianId" TEXT NOT NULL,
  "coverLetter" TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "appliedAt" TIMESTAMP DEFAULT NOW(),
  "reviewedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("jobId", "veterinarianId")
);

-- Create indexes for applications table
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications("jobId");
CREATE INDEX IF NOT EXISTS idx_applications_veterinarian_id ON applications("veterinarianId");
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Log the migration
INSERT INTO migration_log (migration_name, executed_at, description) 
VALUES (
  '002_ensure_jobs_table_structure', 
  NOW(), 
  'Ensured jobs and applications tables have correct structure'
) ON CONFLICT (migration_name) DO NOTHING;