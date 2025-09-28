-- Create hospitals table migration
-- This migration creates the hospitals table if it doesn't exist

CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR PRIMARY KEY,
    "userId" VARCHAR UNIQUE NOT NULL,
    "hospitalName" VARCHAR NOT NULL,
    "representativeName" VARCHAR NOT NULL,
    "businessNumber" VARCHAR UNIQUE,
    "businessLicenseFile" VARCHAR,
    "establishedDate" TIMESTAMP(6),
    "hospitalAddress" VARCHAR,
    "hospitalAddressDetail" VARCHAR,
    "postalCode" VARCHAR,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    "hospitalLogo" VARCHAR,
    "hospitalWebsite" VARCHAR,
    "hospitalDescription" TEXT,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint
ALTER TABLE hospitals 
    DROP CONSTRAINT IF EXISTS fk_hospitals_user;
ALTER TABLE hospitals 
    ADD CONSTRAINT fk_hospitals_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_hospitals_business_number ON hospitals("businessNumber");
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_hospitals_userid ON hospitals("userId");

-- Create hospital_images table if not exists
CREATE TABLE IF NOT EXISTS hospital_images (
    id VARCHAR PRIMARY KEY,
    "hospitalId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "imageUrl" VARCHAR NOT NULL,
    description TEXT,
    "displayOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints for hospital_images
ALTER TABLE hospital_images 
    DROP CONSTRAINT IF EXISTS fk_hospital_images_hospital;
ALTER TABLE hospital_images 
    ADD CONSTRAINT fk_hospital_images_hospital 
    FOREIGN KEY ("hospitalId") REFERENCES hospitals(id) ON DELETE CASCADE;

ALTER TABLE hospital_images 
    DROP CONSTRAINT IF EXISTS fk_hospital_images_user;
ALTER TABLE hospital_images 
    ADD CONSTRAINT fk_hospital_images_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- Add indexes for hospital_images
CREATE INDEX IF NOT EXISTS idx_hospital_images_hospital_id ON hospital_images("hospitalId");
CREATE INDEX IF NOT EXISTS idx_hospital_images_user_id ON hospital_images("userId");

-- Create hospital_treatment_animals table if not exists
CREATE TABLE IF NOT EXISTS hospital_treatment_animals (
    id VARCHAR PRIMARY KEY,
    "hospitalId" VARCHAR NOT NULL,
    "animalType" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for hospital_treatment_animals
ALTER TABLE hospital_treatment_animals 
    DROP CONSTRAINT IF EXISTS fk_hospital_treatment_animals_hospital;
ALTER TABLE hospital_treatment_animals 
    ADD CONSTRAINT fk_hospital_treatment_animals_hospital 
    FOREIGN KEY ("hospitalId") REFERENCES hospitals(id) ON DELETE CASCADE;

-- Add index for hospital_treatment_animals
CREATE INDEX IF NOT EXISTS idx_hospital_treatment_animals_hospital_id ON hospital_treatment_animals("hospitalId");

-- Create hospital_treatment_specialties table if not exists
CREATE TABLE IF NOT EXISTS hospital_treatment_specialties (
    id VARCHAR PRIMARY KEY,
    "hospitalId" VARCHAR NOT NULL,
    specialty VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for hospital_treatment_specialties
ALTER TABLE hospital_treatment_specialties 
    DROP CONSTRAINT IF EXISTS fk_hospital_treatment_specialties_hospital;
ALTER TABLE hospital_treatment_specialties 
    ADD CONSTRAINT fk_hospital_treatment_specialties_hospital 
    FOREIGN KEY ("hospitalId") REFERENCES hospitals(id) ON DELETE CASCADE;

-- Add index for hospital_treatment_specialties
CREATE INDEX IF NOT EXISTS idx_hospital_treatment_specialties_hospital_id ON hospital_treatment_specialties("hospitalId");

-- Log this migration
INSERT INTO migration_log (migration_name, description, executed_at) 
VALUES ('005_create_hospitals_table.sql', 'Create hospitals table and related tables', NOW())
ON CONFLICT (migration_name) DO NOTHING;