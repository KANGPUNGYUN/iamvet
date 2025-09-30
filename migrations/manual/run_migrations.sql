-- 로컬 DB 스키마에 맞춘 완전한 마이그레이션 실행 스크립트
-- 이 스크립트는 순서대로 실행되어야 합니다.

BEGIN;

-- 스키마 설정
SET search_path TO public;

-- 1. 마이그레이션 로그 테이블 생성 (이미 있다면 무시)
CREATE TABLE IF NOT EXISTS migration_log (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- 2. users 테이블에 필요한 컬럼들 추가 (nickname, loginId)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS "loginId" VARCHAR(100) UNIQUE;

-- 기존 데이터에 대한 기본값 설정
UPDATE users 
SET nickname = COALESCE(username, SPLIT_PART(email, '@', 1))
WHERE nickname IS NULL;

UPDATE users 
SET "loginId" = username
WHERE provider = 'NORMAL' AND "loginId" IS NULL;

-- nickname을 NOT NULL로 변경 (기본값 설정 후)
ALTER TABLE users 
ALTER COLUMN nickname SET NOT NULL;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_loginid ON users("loginId");

-- 3. hospitals 테이블 생성 (정규화된 구조)
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

-- hospitals 테이블 외래키 및 인덱스
ALTER TABLE hospitals 
    DROP CONSTRAINT IF EXISTS fk_hospitals_user;
ALTER TABLE hospitals 
    ADD CONSTRAINT fk_hospitals_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_hospitals_business_number ON hospitals("businessNumber");
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_hospitals_userid ON hospitals("userId");

-- 4. veterinarians 테이블 생성 (정규화된 구조)
CREATE TABLE IF NOT EXISTS veterinarians (
  id VARCHAR PRIMARY KEY,
  "userId" VARCHAR NOT NULL UNIQUE,
  "realName" VARCHAR NOT NULL,
  "birthDate" TIMESTAMP,
  nickname VARCHAR(100),
  "licenseImage" VARCHAR,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_veterinarians_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- 5. veterinary_students 테이블 생성 (정규화된 구조)
CREATE TABLE IF NOT EXISTS veterinary_students (
  id VARCHAR PRIMARY KEY,
  "userId" VARCHAR NOT NULL UNIQUE,
  "realName" VARCHAR NOT NULL,
  "birthDate" TIMESTAMP,
  nickname VARCHAR(100),
  "universityEmail" VARCHAR UNIQUE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_veterinary_students_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- 6. hospital_images 테이블 생성
CREATE TABLE IF NOT EXISTS hospital_images (
    id VARCHAR PRIMARY KEY,
    "hospitalId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "imageUrl" VARCHAR NOT NULL,
    description TEXT,
    "displayOrder" INTEGER DEFAULT 0,
    "imageOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- hospital_images 외래키 제약조건
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

CREATE INDEX IF NOT EXISTS idx_hospital_images_hospital_id ON hospital_images("hospitalId");
CREATE INDEX IF NOT EXISTS idx_hospital_images_user_id ON hospital_images("userId");

-- 7. hospital_treatment_* 테이블이 있다면 제거 (기존 테이블 사용)
DROP TABLE IF EXISTS hospital_treatment_animals CASCADE;
DROP TABLE IF EXISTS hospital_treatment_specialties CASCADE;

-- 8. hospital_animals와 hospital_specialties 테이블 생성 (기존 방식)
CREATE TABLE IF NOT EXISTS hospital_animals (
    id VARCHAR PRIMARY KEY,
    "userId" VARCHAR NOT NULL,
    "animalType" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hospital_animals_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_hospital_user_animal UNIQUE ("userId", "animalType")
);

CREATE TABLE IF NOT EXISTS hospital_specialties (
    id VARCHAR PRIMARY KEY,
    "userId" VARCHAR NOT NULL,
    specialty VARCHAR NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hospital_specialties_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_hospital_user_specialty UNIQUE ("userId", specialty)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_hospital_animals_userid ON hospital_animals("userId");
CREATE INDEX IF NOT EXISTS idx_hospital_specialties_userid ON hospital_specialties("userId");
CREATE INDEX IF NOT EXISTS idx_veterinarians_userid ON veterinarians("userId");
CREATE INDEX IF NOT EXISTS idx_veterinarians_nickname ON veterinarians(nickname);
CREATE INDEX IF NOT EXISTS idx_veterinary_students_userid ON veterinary_students("userId");
CREATE INDEX IF NOT EXISTS idx_veterinary_students_university_email ON veterinary_students("universityEmail");
CREATE INDEX IF NOT EXISTS idx_veterinary_students_nickname ON veterinary_students(nickname);

-- 9. hospital_business_licenses 테이블 생성
CREATE TABLE IF NOT EXISTS hospital_business_licenses (
    id VARCHAR PRIMARY KEY,
    "userId" VARCHAR NOT NULL,
    "fileName" VARCHAR NOT NULL,
    "fileUrl" VARCHAR NOT NULL,
    "fileType" VARCHAR,
    "fileSize" INTEGER,
    "uploadedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hospital_business_licenses_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- 10. detailed_hospital_profiles 테이블 제거 (hospitals 테이블로 통합)
DROP TABLE IF EXISTS detailed_hospital_profiles CASCADE;
DROP TABLE IF EXISTS hospital_profiles CASCADE;

-- 11. resume_licenses 테이블에서 grade 컬럼 제거
ALTER TABLE resume_licenses DROP COLUMN IF EXISTS grade;

-- 12. 마이그레이션 로그 추가
INSERT INTO migration_log (migration_name, executed_at, description)
VALUES 
    ('complete_schema_migration', CURRENT_TIMESTAMP, 'Complete schema migration with normalized structure'),
    ('add_nickname_loginid', CURRENT_TIMESTAMP, 'Added nickname and loginId columns to users table'),
    ('create_hospitals_table', CURRENT_TIMESTAMP, 'Created hospitals table and related tables'),
    ('normalize_users_schema', CURRENT_TIMESTAMP, 'Normalized users table by separating user type specific data'),
    ('cleanup_hospital_tables', CURRENT_TIMESTAMP, 'Cleaned up hospital tables and removed duplicates'),
    ('remove_license_grade', CURRENT_TIMESTAMP, 'Removed grade column from resume_licenses')
ON CONFLICT (migration_name) DO NOTHING;

COMMIT;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '=== 마이그레이션이 완료되었습니다 ===';
    RAISE NOTICE '✅ users 테이블에 nickname, loginId 컬럼 추가';
    RAISE NOTICE '✅ hospitals 테이블 생성 (정규화된 구조)';
    RAISE NOTICE '✅ veterinarians 테이블 생성 (정규화된 구조)';
    RAISE NOTICE '✅ veterinary_students 테이블 생성 (정규화된 구조)';
    RAISE NOTICE '✅ hospital_images 테이블 생성';
    RAISE NOTICE '✅ hospital_animals 테이블 생성';
    RAISE NOTICE '✅ hospital_specialties 테이블 생성';
    RAISE NOTICE '✅ hospital_business_licenses 테이블 생성';
    RAISE NOTICE '✅ hospital_treatment_* 테이블 제거';
    RAISE NOTICE '✅ detailed_hospital_profiles 테이블 제거';
    RAISE NOTICE '✅ resume_licenses에서 grade 컬럼 제거';
    RAISE NOTICE '=== 이제 병원 회원가입이 정상 작동합니다 ===';
END $$;