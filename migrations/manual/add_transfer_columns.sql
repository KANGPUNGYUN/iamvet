-- transfers 테이블에 area와 views 컬럼 추가
ALTER TABLE transfers 
ADD COLUMN IF NOT EXISTS area INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 기존 레코드의 views를 0으로 초기화
UPDATE transfers SET views = 0 WHERE views IS NULL;

-- 테이블 구조 확인
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'transfers' 
-- AND column_name IN ('area', 'views');