-- Production 환경용 transfers 테이블 documents 컬럼 추가 마이그레이션
-- 실행 시간: 2025-10-29
-- 목적: 양도양수 게시글에 문서 파일 업로드 기능 지원

BEGIN;

-- 1. documents 컬럼 추가
ALTER TABLE transfers 
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- 2. 기존 레코드 초기화
UPDATE transfers 
SET documents = '[]'::jsonb 
WHERE documents IS NULL;

-- 3. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_transfers_documents 
ON transfers USING GIN (documents);

-- 4. 마이그레이션 로그 기록 (migration_log 테이블이 있는 경우)
INSERT INTO migration_log (migration_name, executed_at, description)
VALUES (
    'add_documents_column_to_transfers',
    NOW(),
    'Added documents JSONB column to transfers table for file attachments'
) ON CONFLICT DO NOTHING;

COMMIT;

-- 검증 쿼리 (실행 후 확인용)
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'transfers' 
AND column_name = 'documents';