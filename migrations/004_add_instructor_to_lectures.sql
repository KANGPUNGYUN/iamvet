-- Migration: Add instructor column to lectures table
-- Date: 2025-09-26

-- Add instructor column to lectures table
ALTER TABLE lectures ADD COLUMN instructor VARCHAR(255);

-- Update existing records with default instructor value
UPDATE lectures SET instructor = '강사명' WHERE instructor IS NULL;

-- Log the migration
INSERT INTO migration_log (migration_name, executed_at) 
VALUES ('004_add_instructor_to_lectures', NOW());