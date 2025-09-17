-- Migration script to fix veterinarian_profiles table
-- 1. Remove introduction field from veterinarian_profiles
-- 2. Ensure licenseImage upload functionality works correctly

BEGIN;

-- Remove introduction column from veterinarian_profiles table
ALTER TABLE veterinarian_profiles DROP COLUMN IF EXISTS introduction;

-- Verify the licenseImage field exists in users table (should already exist)
-- This is just a safety check - the field should already be there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'licenseImage'
    ) THEN
        ALTER TABLE users ADD COLUMN "licenseImage" VARCHAR;
    END IF;
END $$;

-- Add index for licenseImage if it doesn't exist for better query performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_license_image 
ON users("licenseImage") 
WHERE "licenseImage" IS NOT NULL;

COMMIT;