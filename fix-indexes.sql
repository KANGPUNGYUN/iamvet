-- 기존 인덱스 정리 및 새로운 스키마 적용을 위한 스크립트

BEGIN;

-- 기존에 생성된 인덱스들 제거 (만약 존재한다면)
DROP INDEX IF EXISTS idx_users_university_email;
DROP INDEX IF EXISTS idx_users_business_number;
DROP INDEX IF EXISTS idx_users_login_id_unique;
DROP INDEX IF EXISTS idx_users_university_email_unique;
DROP INDEX IF EXISTS idx_users_business_number_unique;

-- username 컬럼 데이터를 loginId로 복사 (아직 안 된 경우)
UPDATE users SET "loginId" = username WHERE "loginId" IS NULL AND username IS NOT NULL;

-- 필수 필드에 대한 NOT NULL 제약조건 추가 전에 기본값 설정
UPDATE users SET "termsAgreedAt" = "createdAt" WHERE "termsAgreedAt" IS NULL;
UPDATE users SET "privacyAgreedAt" = "createdAt" WHERE "privacyAgreedAt" IS NULL;
UPDATE users SET "realName" = COALESCE(nickname, "hospitalName", 'Unknown') WHERE "realName" IS NULL;

COMMIT;