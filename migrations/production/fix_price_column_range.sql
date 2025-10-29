-- transfers 테이블의 price 컬럼을 BIGINT로 변경
-- PostgreSQL INTEGER 범위 초과 문제 해결
-- 실행 시간: 2025-10-29

BEGIN;

-- 1. price 컬럼 타입을 INTEGER에서 BIGINT로 변경
ALTER TABLE transfers 
ALTER COLUMN price TYPE BIGINT;

-- 2. 마이그레이션 로그 기록
INSERT INTO migration_log (migration_name, executed_at, description)
VALUES (
    'fix_price_column_range',
    NOW(),
    'Changed price column from INTEGER to BIGINT to support larger values'
) ON CONFLICT DO NOTHING;

COMMIT;

-- 검증 쿼리
SELECT 
    column_name, 
    data_type, 
    numeric_precision,
    numeric_scale
FROM information_schema.columns 
WHERE table_name = 'transfers' 
AND column_name = 'price';