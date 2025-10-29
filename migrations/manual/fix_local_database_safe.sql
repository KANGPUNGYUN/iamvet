-- 로컬 데이터베이스 안전한 마이그레이션
-- 단계별로 진행

-- 1. price 컬럼만 먼저 변경
ALTER TABLE transfers 
ALTER COLUMN price TYPE BIGINT;

-- 2. documents 컬럼 기본값 제거
ALTER TABLE transfers 
ALTER COLUMN documents DROP DEFAULT;

-- 3. documents 컬럼을 JSONB로 변경 (기존 데이터 무시하고 빈 배열로)
ALTER TABLE transfers 
ALTER COLUMN documents TYPE JSONB USING '[]'::jsonb;

-- 4. documents 컬럼에 기본값 설정
ALTER TABLE transfers 
ALTER COLUMN documents SET DEFAULT '[]'::jsonb;

-- 5. documents 컬럼에 GIN 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_transfers_documents 
ON transfers USING GIN (documents);