-- Run this SQL in your Neon database console to fix the licenseImage constraint issue
-- This will make the licenseImage column nullable as intended in the Prisma schema

ALTER TABLE "veterinarian_profiles" ALTER COLUMN "licenseImage" DROP NOT NULL;

-- Verify the change
\d veterinarian_profiles;