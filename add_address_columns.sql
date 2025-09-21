-- transfers 테이블에 기본주소, 상세주소, 지역 컬럼 추가
ALTER TABLE transfers 
ADD COLUMN IF NOT EXISTS base_address VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS detail_address VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sido VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sigungu VARCHAR(50) DEFAULT NULL;

-- 기존 location 데이터를 기본주소로 임시 복사 (나중에 수동으로 정리 필요)
UPDATE transfers 
SET base_address = location 
WHERE location IS NOT NULL AND base_address IS NULL;

-- 테이블 구조 확인
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'transfers' 
-- AND column_name IN ('base_address', 'detail_address', 'sido', 'sigungu');