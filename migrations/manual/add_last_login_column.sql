-- users 테이블에 lastLoginAt 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP NULL;

-- 기존 사용자들의 lastLoginAt을 현재 시간으로 초기화 (선택사항)
-- UPDATE users SET "lastLoginAt" = "updatedAt" WHERE "lastLoginAt" IS NULL;

-- 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'lastLoginAt';