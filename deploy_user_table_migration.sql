-- 배포 환경 사용자 테이블 마이그레이션 스크립트
-- 실행 날짜: 2025-09-17
-- 목적: 개발 환경의 최신 스키마를 배포 환경에 적용

BEGIN;

-- 1. nickname 컬럼 추가 (nullable로 시작)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- 2. loginId 컬럼 추가 (unique 제약조건 포함)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "loginId" VARCHAR(100);

-- 3. birthDate 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP(3);

-- 4. realName 컬럼이 없다면 추가 (nullable)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "realName" VARCHAR(100);

-- 5. 기존 데이터에 대한 기본값 설정
-- nickname은 username 또는 이메일 앞부분을 기본값으로 설정
UPDATE users 
SET nickname = COALESCE(username, SPLIT_PART(email, '@', 1))
WHERE nickname IS NULL;

-- 6. loginId는 일반 로그인 사용자의 경우 username으로, SNS 사용자는 NULL로 유지
UPDATE users 
SET "loginId" = username
WHERE provider = 'NORMAL' AND "loginId" IS NULL;

-- 7. nickname을 NOT NULL로 변경 (기본값 설정 후)
ALTER TABLE users 
ALTER COLUMN nickname SET NOT NULL;

-- 8. loginId에 unique 제약조건 추가
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS users_loginid_unique UNIQUE ("loginId");

-- 9. 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_loginid ON users("loginId");
CREATE INDEX IF NOT EXISTS idx_users_birth_date ON users("birthDate");

-- 10. 컬럼 코멘트 추가
COMMENT ON COLUMN users.nickname IS '사용자 닉네임';
COMMENT ON COLUMN users."loginId" IS '로그인용 아이디 (소셜 로그인 시 null)';
COMMENT ON COLUMN users."birthDate" IS '사용자 생년월일';
COMMENT ON COLUMN users."realName" IS '사용자 실명';

COMMIT;

-- 마이그레이션 완료 후 확인 쿼리
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
-- ORDER BY ordinal_position;