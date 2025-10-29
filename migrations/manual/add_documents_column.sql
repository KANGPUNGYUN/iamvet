-- transfers 테이블에 documents 컬럼 추가
-- 양도양수 게시글에 첨부된 문서 파일 URL들을 저장하는 컬럼

-- documents 컬럼 추가 (JSON 배열 타입)
ALTER TABLE transfers 
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- 기존 레코드의 documents를 빈 배열로 초기화
UPDATE transfers 
SET documents = '[]'::jsonb 
WHERE documents IS NULL;

-- 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_transfers_documents 
ON transfers USING GIN (documents);

-- 테이블 구조 확인 쿼리 (실행 시 주석 해제)
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'transfers' 
-- AND column_name = 'documents';

-- 샘플 데이터 확인 쿼리 (실행 시 주석 해제)
-- SELECT id, title, documents 
-- FROM transfers 
-- LIMIT 5;