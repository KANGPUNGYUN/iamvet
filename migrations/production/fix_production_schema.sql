-- 배포환경 데이터베이스를 로컬환경과 동기화하는 마이그레이션 스크립트
-- 로컬환경의 스키마에 맞춰 배포환경을 수정

BEGIN;

-- 1. 백업 테이블 생성 (안전을 위해)
CREATE TABLE IF NOT EXISTS backup_users_schema_fix AS SELECT * FROM users;

-- 2. users 테이블에 누락된 컬럼들 추가
-- 로컬 스키마와 비교하여 누락된 컬럼들을 추가

-- realName 컬럼 (필수)
ALTER TABLE users ADD COLUMN IF NOT EXISTS "realName" TEXT;

-- birthDate 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP;

-- nickname 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "nickname" VARCHAR(100);

-- loginId 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "loginId" VARCHAR(100);

-- universityEmail 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "universityEmail" TEXT;

-- hospitalName 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalName" TEXT;

-- establishedDate 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "establishedDate" TIMESTAMP;

-- businessNumber 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "businessNumber" TEXT;

-- hospitalWebsite 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalWebsite" TEXT;

-- hospitalLogo 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalLogo" TEXT;

-- hospitalAddress 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalAddress" TEXT;

-- hospitalAddressDetail 컬럼
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hospitalAddressDetail" TEXT;

-- licenseImage 컬럼 (이게 문제의 원인)
ALTER TABLE users ADD COLUMN IF NOT EXISTS "licenseImage" TEXT;

-- seq 컬럼 (auto increment)
ALTER TABLE users ADD COLUMN IF NOT EXISTS "seq" SERIAL;

-- 3. 제약조건 추가 (이미 존재하는 경우 무시)
-- loginId unique 제약조건
CREATE UNIQUE INDEX IF NOT EXISTS users_loginId_unique ON users("loginId") WHERE "loginId" IS NOT NULL;

-- universityEmail unique 제약조건
CREATE UNIQUE INDEX IF NOT EXISTS users_universityEmail_unique ON users("universityEmail") WHERE "universityEmail" IS NOT NULL;

-- businessNumber unique 제약조건
CREATE UNIQUE INDEX IF NOT EXISTS users_businessNumber_unique ON users("businessNumber") WHERE "businessNumber" IS NOT NULL;

-- seq unique 제약조건
CREATE UNIQUE INDEX IF NOT EXISTS users_seq_unique ON users("seq");

-- 4. 기존 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_loginid ON users("loginId");
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users("nickname");

-- 5. UserType enum에 VETERINARY_STUDENT 추가 (이미 존재할 수 있음)
-- PostgreSQL에서 enum 타입에 값 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'VETERINARY_STUDENT' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserType')) THEN
        ALTER TYPE "UserType" ADD VALUE 'VETERINARY_STUDENT';
    END IF;
END
$$;

-- 6. 테이블 생성 (존재하지 않는 경우에만)
-- veterinarian_profiles 테이블
CREATE TABLE IF NOT EXISTS veterinarian_profiles (
    id TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    "birthDate" TIMESTAMP,
    "licenseImage" TEXT,
    experience TEXT,
    specialty TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "deletedAt" TIMESTAMP
);

-- hospital_profiles 테이블
CREATE TABLE IF NOT EXISTS hospital_profiles (
    id TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "hospitalName" TEXT NOT NULL,
    "businessNumber" TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    website TEXT,
    description TEXT,
    "businessLicense" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "deletedAt" TIMESTAMP
);

-- migration_log 테이블
CREATE TABLE IF NOT EXISTS migration_log (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT NOW(),
    description TEXT
);

-- 7. 마이그레이션 로그 기록
INSERT INTO migration_log (migration_name, description, executed_at) 
VALUES ('fix_production_schema_sync', '배포환경을 로컬환경 스키마와 동기화', NOW())
ON CONFLICT (migration_name) DO NOTHING;

-- 8. 데이터 검증
-- realName이 NULL인 사용자들에 대해 기본값 설정 (필요시)
UPDATE users 
SET "realName" = COALESCE(nickname, email) 
WHERE "realName" IS NULL;

COMMIT;

-- 성공 메시지
SELECT 'Schema synchronization completed successfully!' as result;