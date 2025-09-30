-- Create job_postings table for the new job posting feature
CREATE TABLE IF NOT EXISTS "job_postings" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workType" TEXT[] NOT NULL DEFAULT '{}',
    "isUnlimitedRecruit" BOOLEAN NOT NULL DEFAULT false,
    "recruitEndDate" TIMESTAMP(3),
    "major" TEXT[] NOT NULL DEFAULT '{}',
    "experience" TEXT[] NOT NULL DEFAULT '{}',
    "position" TEXT NOT NULL,
    "salaryType" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "workDays" TEXT[] NOT NULL DEFAULT '{}',
    "isWorkDaysNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "workStartTime" TEXT,
    "workEndTime" TEXT,
    "isWorkTimeNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "benefits" TEXT,
    "education" TEXT[] NOT NULL DEFAULT '{}',
    "certifications" TEXT[] NOT NULL DEFAULT '{}',
    "experienceDetails" TEXT[] NOT NULL DEFAULT '{}',
    "preferences" TEXT[] NOT NULL DEFAULT '{}',
    "managerName" TEXT NOT NULL,
    "managerPhone" TEXT NOT NULL,
    "managerEmail" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'job_postings_hospitalId_fkey'
    ) THEN
        ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_hospitalId_fkey" 
            FOREIGN KEY ("hospitalId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "job_postings_hospitalId_idx" ON "job_postings"("hospitalId");
CREATE INDEX IF NOT EXISTS "job_postings_isActive_idx" ON "job_postings"("isActive");
CREATE INDEX IF NOT EXISTS "job_postings_isDraft_idx" ON "job_postings"("isDraft");
CREATE INDEX IF NOT EXISTS "job_postings_createdAt_idx" ON "job_postings"("createdAt");

-- Add hospital_animals table for storing treatment animals
CREATE TABLE IF NOT EXISTS "hospital_animals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "animalType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_animals_pkey" PRIMARY KEY ("id")
);

-- Add hospital_specialties table for storing treatment specialties  
CREATE TABLE IF NOT EXISTS "hospital_specialties" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_specialties_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints for hospital related tables only if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hospital_animals_userId_fkey'
    ) THEN
        ALTER TABLE "hospital_animals" ADD CONSTRAINT "hospital_animals_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hospital_specialties_userId_fkey'
    ) THEN
        ALTER TABLE "hospital_specialties" ADD CONSTRAINT "hospital_specialties_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Add hospital facility images table
CREATE TABLE IF NOT EXISTS "hospital_facility_images" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_facility_images_pkey" PRIMARY KEY ("id")
);

-- Add hospital business licenses table
CREATE TABLE IF NOT EXISTS "hospital_business_licenses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_business_licenses_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints only if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hospital_facility_images_userId_fkey'
    ) THEN
        ALTER TABLE "hospital_facility_images" ADD CONSTRAINT "hospital_facility_images_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hospital_business_licenses_userId_fkey'
    ) THEN
        ALTER TABLE "hospital_business_licenses" ADD CONSTRAINT "hospital_business_licenses_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Update users table to include additional hospital fields if they don't exist
DO $$ 
BEGIN
    -- Add hospital-related columns to users table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'loginId') THEN
        ALTER TABLE "users" ADD COLUMN "loginId" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'realName') THEN
        ALTER TABLE "users" ADD COLUMN "realName" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'birthDate') THEN
        ALTER TABLE "users" ADD COLUMN "birthDate" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'nickname') THEN
        ALTER TABLE "users" ADD COLUMN "nickname" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'licenseImage') THEN
        ALTER TABLE "users" ADD COLUMN "licenseImage" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'hospitalName') THEN
        ALTER TABLE "users" ADD COLUMN "hospitalName" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'hospitalLogo') THEN
        ALTER TABLE "users" ADD COLUMN "hospitalLogo" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'businessNumber') THEN
        ALTER TABLE "users" ADD COLUMN "businessNumber" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'hospitalAddress') THEN
        ALTER TABLE "users" ADD COLUMN "hospitalAddress" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'hospitalAddressDetail') THEN
        ALTER TABLE "users" ADD COLUMN "hospitalAddressDetail" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'hospitalWebsite') THEN
        ALTER TABLE "users" ADD COLUMN "hospitalWebsite" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'establishedDate') THEN
        ALTER TABLE "users" ADD COLUMN "establishedDate" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'universityEmail') THEN
        ALTER TABLE "users" ADD COLUMN "universityEmail" TEXT;
    END IF;

    -- Add VETERINARY_STUDENT to UserType enum if it doesn't exist
    BEGIN
        ALTER TYPE "UserType" ADD VALUE IF NOT EXISTS 'VETERINARY_STUDENT';
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;