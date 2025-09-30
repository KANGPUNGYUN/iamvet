-- 기존 데이터를 보존하면서 새로운 구조로 안전하게 마이그레이션

BEGIN;

-- 1. 기존 데이터를 새로운 컬럼으로 이전
-- users 테이블에 새로운 컬럼들을 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS "loginId" VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS "universityEmail" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalName" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "establishedDate" TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "businessNumber" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalWebsite" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalLogo" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalAddress" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalAddressDetail" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "licenseImage" TEXT;

-- 2. 기존 데이터를 새로운 구조로 이전
-- username을 loginId로 복사
UPDATE users SET "loginId" = username WHERE "loginId" IS NULL;

-- veterinarian_profiles에서 데이터 이전
UPDATE users 
SET 
  nickname = vp.nickname,
  "birthDate" = vp."birthDate",
  "licenseImage" = vp."licenseImage"
FROM veterinarian_profiles vp 
WHERE users.id = vp."userId" 
  AND users."userType" = 'VETERINARIAN'
  AND vp."deletedAt" IS NULL;

-- hospital_profiles에서 데이터 이전
UPDATE users 
SET 
  "hospitalName" = hp."hospitalName",
  "businessNumber" = hp."businessNumber",
  "hospitalAddress" = hp.address,
  "hospitalWebsite" = hp.website
FROM hospital_profiles hp 
WHERE users.id = hp."userId" 
  AND users."userType" = 'HOSPITAL'
  AND hp."deletedAt" IS NULL;

-- 3. VETERINARY_STUDENT enum 값 추가 (if not exists)
-- PostgreSQL에서 enum에 값 추가
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'VETERINARY_STUDENT' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserType')) THEN
        ALTER TYPE "UserType" ADD VALUE 'VETERINARY_STUDENT';
    END IF;
END $$;

-- 4. 새로운 테이블들 생성
CREATE TABLE IF NOT EXISTS hospital_facility_images (
  id TEXT PRIMARY KEY DEFAULT concat('hfi_', extract(epoch from now())::text, '_', random()::text),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "imageUrl" TEXT NOT NULL,
  "displayOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- AnimalType enum 생성
DO $$ BEGIN
    CREATE TYPE "AnimalType" AS ENUM ('DOG', 'CAT', 'EXOTIC', 'LARGE_ANIMAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS hospital_animals (
  id TEXT PRIMARY KEY DEFAULT concat('ha_', extract(epoch from now())::text, '_', random()::text),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "animalType" "AnimalType" NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "animalType")
);

-- SpecialtyType enum 생성
DO $$ BEGIN
    CREATE TYPE "SpecialtyType" AS ENUM ('INTERNAL_MEDICINE', 'SURGERY', 'DERMATOLOGY', 'DENTISTRY', 'OPHTHALMOLOGY', 'NEUROLOGY', 'ORTHOPEDICS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS hospital_specialties (
  id TEXT PRIMARY KEY DEFAULT concat('hs_', extract(epoch from now())::text, '_', random()::text),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "specialty" "SpecialtyType" NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "specialty")
);

CREATE TABLE IF NOT EXISTS hospital_business_licenses (
  id TEXT PRIMARY KEY DEFAULT concat('hbl_', extract(epoch from now())::text, '_', random()::text),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "fileSize" BIGINT,
  "uploadedAt" TIMESTAMP DEFAULT NOW()
);

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_login_id ON users("loginId") WHERE "loginId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_university_email ON users("universityEmail") WHERE "universityEmail" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_business_number ON users("businessNumber") WHERE "businessNumber" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hospital_facility_images_user_id ON hospital_facility_images("userId");
CREATE INDEX IF NOT EXISTS idx_hospital_animals_user_id ON hospital_animals("userId");
CREATE INDEX IF NOT EXISTS idx_hospital_specialties_user_id ON hospital_specialties("userId");

-- 6. 새로운 unique 제약조건 추가 (기존 데이터와 충돌하지 않는 경우만)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_login_id_unique ON users("loginId") WHERE "loginId" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_university_email_unique ON users("universityEmail") WHERE "universityEmail" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_business_number_unique ON users("businessNumber") WHERE "businessNumber" IS NOT NULL;

COMMIT;