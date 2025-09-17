-- 마이그레이션: nickname과 loginId 컬럼 추가
-- 실행 날짜: 2025-01-17

BEGIN;

-- users 테이블에 nickname과 loginId 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS "loginId" VARCHAR(100) UNIQUE;

-- 기존 데이터에 대한 기본값 설정
-- nickname은 username 또는 이메일 앞부분을 기본값으로 설정
UPDATE users 
SET nickname = COALESCE(username, SPLIT_PART(email, '@', 1))
WHERE nickname IS NULL;

-- loginId는 일반 로그인 사용자의 경우 username으로, SNS 사용자는 NULL로 유지
UPDATE users 
SET "loginId" = username
WHERE provider = 'NORMAL' AND "loginId" IS NULL;

-- nickname을 NOT NULL로 변경 (기본값 설정 후)
ALTER TABLE users 
ALTER COLUMN nickname SET NOT NULL;

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_loginid ON users("loginId");

COMMIT;