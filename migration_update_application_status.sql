-- Migration to update ApplicationStatus enum values
-- This migration updates the ApplicationStatus enum to support the new 6-stage workflow

-- First, add the new enum values to the existing enum type
ALTER TYPE "ApplicationStatus" ADD VALUE 'APPLYING';
ALTER TYPE "ApplicationStatus" ADD VALUE 'DOCUMENT_REVIEW';
ALTER TYPE "ApplicationStatus" ADD VALUE 'DOCUMENT_PASS';
ALTER TYPE "ApplicationStatus" ADD VALUE 'INTERVIEW_PASS';
ALTER TYPE "ApplicationStatus" ADD VALUE 'FINAL_PASS';

-- Update existing records to map to the new values
-- PENDING -> APPLYING (지원 중)
-- REVIEWING -> DOCUMENT_REVIEW (서류 검토)
-- ACCEPTED -> FINAL_PASS (최종 합격)
-- REJECTED -> REJECTED (불합격, 이미 존재)

UPDATE applications 
SET status = CASE 
  WHEN status = 'PENDING' THEN 'APPLYING'
  WHEN status = 'REVIEWING' THEN 'DOCUMENT_REVIEW'
  WHEN status = 'ACCEPTED' THEN 'FINAL_PASS'
  ELSE status  -- REJECTED는 그대로 유지
END;

-- Note: 기존 enum 값들(PENDING, REVIEWING, ACCEPTED)은 하위 호환성을 위해 
-- 제거하지 않습니다. 필요시 나중에 제거할 수 있습니다.

-- 변경사항 확인을 위한 쿼리 (주석 처리됨)
-- SELECT status, COUNT(*) as count 
-- FROM applications 
-- GROUP BY status 
-- ORDER BY status;