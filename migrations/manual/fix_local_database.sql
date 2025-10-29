-- 로컬 데이터베이스 마이그레이션
-- 1. price 컬럼을 BIGINT로 변경
-- 2. documents 컬럼을 JSONB로 변경 (현재 ARRAY 타입)

BEGIN;

-- 1. price 컬럼 타입을 INTEGER에서 BIGINT로 변경
ALTER TABLE transfers 
ALTER COLUMN price TYPE BIGINT;

-- 2. documents 컬럼을 ARRAY에서 JSONB로 변경
-- 기존 데이터가 있다면 백업 후 진행
ALTER TABLE transfers 
ALTER COLUMN documents TYPE JSONB USING '[]'::jsonb;

-- 3. documents 컬럼에 기본값 설정
ALTER TABLE transfers 
ALTER COLUMN documents SET DEFAULT '[]'::jsonb;

-- 4. 기존 레코드의 documents를 빈 배열로 초기화
UPDATE transfers 
SET documents = '[]'::jsonb 
WHERE documents IS NULL;

-- 5. documents 컬럼에 GIN 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_transfers_documents 
ON transfers USING GIN (documents);

COMMIT;

-- 검증 쿼리
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'transfers' 
AND column_name IN ('price', 'documents');