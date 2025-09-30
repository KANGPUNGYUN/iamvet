-- transfers 테이블에 경도/위도 필드 추가
ALTER TABLE transfers 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 기존 데이터에 대한 기본값 설정 (대한수의학회 좌표)
UPDATE transfers 
SET latitude = 37.4675986079, 
    longitude = 126.9538284887057 
WHERE latitude IS NULL OR longitude IS NULL;