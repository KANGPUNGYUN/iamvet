-- Resume Evaluations 외래 키 제약 조건 수정
-- Step 1: 기존 외래 키 제약 조건 제거
ALTER TABLE resume_evaluations DROP CONSTRAINT IF EXISTS resume_evaluations_resumeId_fkey;

-- Step 2: 새로운 외래 키 제약 조건 추가 (detailed_resumes 참조)
ALTER TABLE resume_evaluations ADD CONSTRAINT resume_evaluations_resumeId_fkey 
FOREIGN KEY ("resumeId") REFERENCES detailed_resumes("id") ON DELETE CASCADE;

-- 확인을 위한 쿼리 (실행 후 확인용)
-- SELECT constraint_name, table_name, column_name 
-- FROM information_schema.key_column_usage 
-- WHERE table_name = 'resume_evaluations' AND constraint_name LIKE '%fkey%';