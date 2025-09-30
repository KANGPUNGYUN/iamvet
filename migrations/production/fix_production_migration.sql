-- 프로덕션 데이터베이스 마이그레이션 문제 해결 스크립트
-- UserType enum 충돌 해결 및 최신 스키마 적용

BEGIN;

-- 1. 기존 UserType enum에 VETERINARY_STUDENT 값 추가 (이미 있다면 무시)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserType') 
        AND enumlabel = 'VETERINARY_STUDENT'
    ) THEN
        ALTER TYPE "UserType" ADD VALUE 'VETERINARY_STUDENT';
    END IF;
END$$;

-- 2. 누락된 컬럼들 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS "loginId" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "realName" VARCHAR(100);

-- 3. Provider enum 확인 및 소셜 로그인 값 추가
DO $$
BEGIN
    -- Provider enum이 없다면 생성
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Provider') THEN
        CREATE TYPE "Provider" AS ENUM ('NORMAL', 'GOOGLE', 'KAKAO', 'NAVER');
    ELSE
        -- 기존 enum에 값 추가
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Provider') AND enumlabel = 'GOOGLE') THEN
            ALTER TYPE "Provider" ADD VALUE 'GOOGLE';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Provider') AND enumlabel = 'KAKAO') THEN
            ALTER TYPE "Provider" ADD VALUE 'KAKAO';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Provider') AND enumlabel = 'NAVER') THEN
            ALTER TYPE "Provider" ADD VALUE 'NAVER';
        END IF;
    END IF;
END$$;

-- 4. provider 컬럼 추가 (아직 없다면)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS provider "Provider" DEFAULT 'NORMAL';

-- 5. veterinarian_profiles 테이블 확인 및 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'veterinarian_profiles') THEN
        CREATE TABLE veterinarian_profiles (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            "userId" TEXT NOT NULL,
            "licenseNumber" TEXT,
            "licenseImage" TEXT,
            "schoolName" TEXT,
            "graduationYear" INTEGER,
            "specialization" TEXT,
            "currentYear" INTEGER,
            "studentId" TEXT,
            "isGraduated" BOOLEAN DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT veterinarian_profiles_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    END IF;
END$$;

-- 6. social_accounts 테이블 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'social_accounts') THEN
        CREATE TABLE social_accounts (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            "userId" TEXT NOT NULL,
            provider "Provider" NOT NULL,
            "providerId" TEXT NOT NULL,
            "providerAccountId" TEXT,
            "accessToken" TEXT,
            "refreshToken" TEXT,
            "expiresAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT social_accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    END IF;
END$$;

-- 7. 기존 데이터에 대한 기본값 설정
UPDATE users 
SET nickname = COALESCE(username, SPLIT_PART(email, '@', 1))
WHERE nickname IS NULL;

UPDATE users 
SET "loginId" = username
WHERE provider = 'NORMAL' AND "loginId" IS NULL;

-- 8. nickname을 NOT NULL로 변경
ALTER TABLE users 
ALTER COLUMN nickname SET NOT NULL;

-- 9. 유니크 제약조건 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'users_loginid_unique') THEN
        ALTER TABLE users ADD CONSTRAINT users_loginid_unique UNIQUE ("loginId");
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'veterinarian_profiles_userId_unique') THEN
        ALTER TABLE veterinarian_profiles ADD CONSTRAINT veterinarian_profiles_userId_unique UNIQUE ("userId");
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'social_accounts_provider_providerId_unique') THEN
        ALTER TABLE social_accounts ADD CONSTRAINT social_accounts_provider_providerId_unique UNIQUE (provider, "providerId");
    END IF;
END$$;

-- 10. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_loginid ON users("loginId");
CREATE INDEX IF NOT EXISTS idx_users_birth_date ON users("birthDate");
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_veterinarian_profiles_userId ON veterinarian_profiles("userId");
CREATE INDEX IF NOT EXISTS idx_social_accounts_userId ON social_accounts("userId");

COMMIT;