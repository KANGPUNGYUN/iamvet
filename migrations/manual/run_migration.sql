-- 마이그레이션 실행 스크립트
-- 이 스크립트를 데이터베이스에서 실행하여 hospitals와 detailed_hospital_profiles 테이블을 통합합니다.

-- 1. hospitals 테이블에 detailed_hospital_profiles의 필수 필드들만 추가
ALTER TABLE "hospitals" 
  ADD COLUMN IF NOT EXISTS "description" TEXT;

-- 2. hospital_facility_images의 외래키를 hospitals 테이블로 변경
-- 먼저 기존 제약 조건 삭제
ALTER TABLE "hospital_facility_images" DROP CONSTRAINT IF EXISTS "hospital_facility_images_userId_fkey";

-- hospital_id 컬럼 추가
ALTER TABLE "hospital_facility_images" 
  ADD COLUMN IF NOT EXISTS "hospital_id" VARCHAR;

-- 기존 데이터 마이그레이션: userId를 사용해서 hospital_id 찾기
UPDATE "hospital_facility_images" hfi
SET "hospital_id" = h.id
FROM "hospitals" h
WHERE h."userId" = hfi."userId";

-- hospital_id를 NOT NULL로 변경
ALTER TABLE "hospital_facility_images" ALTER COLUMN "hospital_id" SET NOT NULL;

-- 새로운 외래키 제약 조건 추가
ALTER TABLE "hospital_facility_images" 
  ADD CONSTRAINT "hospital_facility_images_hospital_id_fkey" 
  FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE;

-- userId 컬럼 제거
ALTER TABLE "hospital_facility_images" DROP COLUMN "userId";

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS "idx_hospital_facility_images_hospital_id" ON "hospital_facility_images" ("hospital_id");

-- 3. 기존 detailed_hospital_profiles 데이터를 hospitals 테이블로 마이그레이션
UPDATE "hospitals" h
SET 
  "description" = dhp."description"
FROM "detailed_hospital_profiles" dhp
WHERE h."userId" = dhp."userId";

-- 4. hospital_profiles 테이블 제거 (hospitals와 중복)
DROP TABLE IF EXISTS "hospital_profiles";

-- 5. detailed_hospital_profiles 테이블 제거
DROP TABLE IF EXISTS "detailed_hospital_profiles";

-- 6. hospital_equipments 테이블 제거 (사용하지 않음)
DROP TABLE IF EXISTS "hospital_equipments";

-- 7. hospital_staff 테이블 제거 (사용하지 않음)
DROP TABLE IF EXISTS "hospital_staff";

-- 8. 마이그레이션 로그 추가
INSERT INTO "migration_log" (migration_name, description, executed_at) 
VALUES ('merge_hospital_tables', 'Merged detailed_hospital_profiles into hospitals table', NOW());