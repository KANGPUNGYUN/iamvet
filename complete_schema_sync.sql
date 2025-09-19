-- 배포환경을 로컬환경과 완전히 동기화하는 전체 마이그레이션 스크립트
-- 실행 전 반드시 백업을 수행하세요!

BEGIN;

-- =====================================================
-- 1. 전체 백업 (안전을 위해)
-- =====================================================
CREATE TABLE IF NOT EXISTS backup_all_tables_$(date +%Y%m%d_%H%M%S) AS 
SELECT 'backup_created_at', NOW()::text;

-- =====================================================
-- 2. USERS 테이블 수정
-- =====================================================
-- username 컬럼 제거 (배포환경에만 있음)
ALTER TABLE users DROP COLUMN IF EXISTS username CASCADE;

-- =====================================================
-- 3. JOBS 테이블 구조 완전 재정의
-- =====================================================
-- 배포환경의 잘못된 컬럼들 제거
ALTER TABLE jobs DROP COLUMN IF EXISTS description CASCADE;
ALTER TABLE jobs DROP COLUMN IF EXISTS location CASCADE;
ALTER TABLE jobs DROP COLUMN IF EXISTS salaryMin CASCADE;
ALTER TABLE jobs DROP COLUMN IF EXISTS salaryMax CASCADE;
ALTER TABLE jobs DROP COLUMN IF EXISTS experienceMin CASCADE;
ALTER TABLE jobs DROP COLUMN IF EXISTS requirements CASCADE;
ALTER TABLE jobs DROP COLUMN IF EXISTS status CASCADE;
ALTER TABLE jobs DROP COLUMN IF EXISTS deadline CASCADE;

-- 로컬환경의 정확한 컬럼들 추가
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "isUnlimitedRecruit" BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "recruitEndDate" TIMESTAMP;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "major" TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "experience" TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "position" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "salary" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "workDays" TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "isWorkDaysNegotiable" BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "workStartTime" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "workEndTime" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "isWorkTimeNegotiable" BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "education" TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "certifications" TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "experienceDetails" TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "preferences" TEXT[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "managerName" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "managerPhone" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "managerEmail" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "department" TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "isDraft" BOOLEAN DEFAULT false;

-- =====================================================
-- 4. VETERINARIAN_PROFILES 테이블 수정
-- =====================================================
-- introduction 컬럼 제거 (배포환경에만 있음)
ALTER TABLE veterinarian_profiles DROP COLUMN IF EXISTS introduction CASCADE;

-- =====================================================
-- 5. 누락된 테이블들 생성
-- =====================================================

-- detailed_resumes 테이블
CREATE TABLE IF NOT EXISTS detailed_resumes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo TEXT,
  name TEXT NOT NULL,
  "birthDate" TEXT,
  introduction TEXT,
  phone TEXT,
  email TEXT,
  "phonePublic" BOOLEAN DEFAULT false,
  "emailPublic" BOOLEAN DEFAULT false,
  position TEXT,
  specialties TEXT[] DEFAULT '{}',
  "preferredRegions" TEXT[] DEFAULT '{}',
  "expectedSalary" TEXT,
  "workTypes" TEXT[] DEFAULT '{}',
  "startDate" TEXT,
  "preferredWeekdays" TEXT[] DEFAULT '{}',
  "weekdaysNegotiable" BOOLEAN DEFAULT false,
  "workStartTime" TEXT,
  "workEndTime" TEXT,
  "workTimeNegotiable" BOOLEAN DEFAULT false,
  "selfIntroduction" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "deletedAt" TIMESTAMP
);

-- resume_experiences 테이블
CREATE TABLE IF NOT EXISTS resume_experiences (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "resumeId" TEXT NOT NULL REFERENCES detailed_resumes(id) ON DELETE CASCADE,
  "hospitalName" TEXT NOT NULL,
  "mainTasks" TEXT NOT NULL,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- resume_licenses 테이블
CREATE TABLE IF NOT EXISTS resume_licenses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "resumeId" TEXT NOT NULL REFERENCES detailed_resumes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  grade TEXT,
  "acquiredDate" TIMESTAMP,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- resume_educations 테이블
CREATE TABLE IF NOT EXISTS resume_educations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "resumeId" TEXT NOT NULL REFERENCES detailed_resumes(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  "graduationStatus" TEXT NOT NULL,
  "schoolName" TEXT NOT NULL,
  major TEXT NOT NULL,
  gpa TEXT,
  "totalGpa" TEXT,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- resume_medical_capabilities 테이블
CREATE TABLE IF NOT EXISTS resume_medical_capabilities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "resumeId" TEXT NOT NULL REFERENCES detailed_resumes(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  description TEXT,
  others TEXT,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- detailed_hospital_profiles 테이블
CREATE TABLE IF NOT EXISTS detailed_hospital_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "hospitalName" TEXT NOT NULL,
  "businessNumber" TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  description TEXT,
  "businessLicense" TEXT,
  "hospitalLogo" TEXT,
  "establishedDate" TEXT,
  "detailAddress" TEXT,
  email TEXT,
  "treatmentAnimals" TEXT[] DEFAULT '{}',
  "treatmentFields" TEXT[] DEFAULT '{}',
  "operatingHours" JSONB,
  "emergencyService" BOOLEAN DEFAULT false,
  "parkingAvailable" BOOLEAN DEFAULT false,
  "publicTransportInfo" TEXT,
  "totalBeds" INTEGER,
  "surgeryRooms" INTEGER,
  "xrayRoom" BOOLEAN DEFAULT false,
  "ctScan" BOOLEAN DEFAULT false,
  ultrasound BOOLEAN DEFAULT false,
  grooming BOOLEAN DEFAULT false,
  boarding BOOLEAN DEFAULT false,
  "petTaxi" BOOLEAN DEFAULT false,
  certifications TEXT[] DEFAULT '{}',
  awards TEXT[] DEFAULT '{}',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "deletedAt" TIMESTAMP
);

-- hospital_staff 테이블
CREATE TABLE IF NOT EXISTS hospital_staff (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "hospitalProfileId" TEXT NOT NULL REFERENCES detailed_hospital_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  specialization TEXT,
  experience TEXT,
  education TEXT,
  "profileImage" TEXT,
  introduction TEXT,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- hospital_equipments 테이블
CREATE TABLE IF NOT EXISTS hospital_equipments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "hospitalProfileId" TEXT NOT NULL REFERENCES detailed_hospital_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  "purchaseDate" TIMESTAMP,
  description TEXT,
  image TEXT,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. 인덱스 추가
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_detailed_resumes_user_id ON detailed_resumes("userId");
CREATE INDEX IF NOT EXISTS idx_resume_experiences_resume_id ON resume_experiences("resumeId");
CREATE INDEX IF NOT EXISTS idx_resume_licenses_resume_id ON resume_licenses("resumeId");
CREATE INDEX IF NOT EXISTS idx_resume_educations_resume_id ON resume_educations("resumeId");
CREATE INDEX IF NOT EXISTS idx_resume_medical_capabilities_resume_id ON resume_medical_capabilities("resumeId");
CREATE INDEX IF NOT EXISTS idx_detailed_hospital_profiles_user_id ON detailed_hospital_profiles("userId");
CREATE INDEX IF NOT EXISTS idx_hospital_staff_hospital_profile_id ON hospital_staff("hospitalProfileId");
CREATE INDEX IF NOT EXISTS idx_hospital_equipments_hospital_profile_id ON hospital_equipments("hospitalProfileId");

-- =====================================================
-- 7. 불필요한 백업 테이블 제거
-- =====================================================
DROP TABLE IF EXISTS backup_users_schema_fix;

-- =====================================================
-- 8. 마이그레이션 로그 기록
-- =====================================================
INSERT INTO migration_log (migration_name, description, executed_at) 
VALUES ('complete_schema_sync', '로컬환경과 배포환경 스키마 완전 동기화', NOW())
ON CONFLICT (migration_name) DO UPDATE SET executed_at = NOW();

-- =====================================================
-- 9. 최종 검증
-- =====================================================
DO $$
DECLARE
    missing_count INTEGER;
BEGIN
    -- users 테이블의 licenseImage 컬럼 확인
    SELECT COUNT(*) INTO missing_count
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'licenseImage';
    
    IF missing_count = 0 THEN
        RAISE EXCEPTION 'licenseImage column is still missing!';
    END IF;
    
    RAISE NOTICE 'Schema synchronization completed successfully!';
END $$;

COMMIT;

-- 성공 메시지
SELECT '✅ 스키마 동기화가 성공적으로 완료되었습니다!' as result;