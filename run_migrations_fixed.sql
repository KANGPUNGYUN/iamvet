-- 로컬 DB 스키마에 맞춘 완전한 마이그레이션 실행 스크립트 (수정됨)
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

-- 2. users 테이블에 필요한 컬럼들은 이미 존재함 - 스킵

-- 3. hospitals 테이블은 이미 존재함 - 스킵

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

-- 6. hospital_treatment_* 테이블이 있다면 제거 (기존 테이블 사용)
DROP TABLE IF EXISTS hospital_treatment_animals CASCADE;
DROP TABLE IF EXISTS hospital_treatment_specialties CASCADE;

-- 7. hospital_animals와 hospital_specialties 테이블은 이미 존재함 - 스킵

-- 8. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_veterinarians_userid ON veterinarians("userId");
CREATE INDEX IF NOT EXISTS idx_veterinarians_nickname ON veterinarians(nickname);
CREATE INDEX IF NOT EXISTS idx_veterinary_students_userid ON veterinary_students("userId");
CREATE INDEX IF NOT EXISTS idx_veterinary_students_university_email ON veterinary_students("universityEmail");
CREATE INDEX IF NOT EXISTS idx_veterinary_students_nickname ON veterinary_students(nickname);

-- 9. detailed_hospital_profiles 테이블 제거 (hospitals 테이블로 통합)
DROP TABLE IF EXISTS detailed_hospital_profiles CASCADE;
DROP TABLE IF EXISTS hospital_profiles CASCADE;

-- 10. resume_licenses 테이블에서 grade 컬럼 제거
ALTER TABLE resume_licenses DROP COLUMN IF EXISTS grade;

-- 11. 마이그레이션 로그 추가
INSERT INTO migration_log (migration_name, executed_at, description)
VALUES 
    ('normalize_users_schema_fixed', CURRENT_TIMESTAMP, 'Normalized users table by creating veterinarians and veterinary_students tables'),
    ('cleanup_hospital_tables_fixed', CURRENT_TIMESTAMP, 'Cleaned up hospital tables and removed duplicates'),
    ('remove_license_grade_fixed', CURRENT_TIMESTAMP, 'Removed grade column from resume_licenses')
ON CONFLICT (migration_name) DO NOTHING;

COMMIT;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '=== 마이그레이션이 완료되었습니다 ===';
    RAISE NOTICE '✅ veterinarians 테이블 생성 (정규화된 구조)';
    RAISE NOTICE '✅ veterinary_students 테이블 생성 (정규화된 구조)';
    RAISE NOTICE '✅ hospital_treatment_* 테이블 제거';
    RAISE NOTICE '✅ detailed_hospital_profiles 테이블 제거';
    RAISE NOTICE '✅ resume_licenses에서 grade 컬럼 제거';
    RAISE NOTICE '=== 이제 병원 회원가입이 정상 작동합니다 ===';
END $$;