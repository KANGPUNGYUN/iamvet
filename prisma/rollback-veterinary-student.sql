-- 수의학과 학생 시스템 롤백 스크립트
-- 주의: 이 스크립트는 수의학과 학생 데이터를 모두 삭제합니다!
-- 실행 전 반드시 백업을 수행하세요.

BEGIN;

-- 롤백 시작 메시지
DO $$
BEGIN
    RAISE NOTICE '🔄 수의학과 학생 시스템 롤백 시작...';
    RAISE WARNING '⚠️  이 작업은 모든 수의학과 학생 데이터를 삭제합니다!';
END $$;

-- 1. 수의학과 학생 사용자 데이터 백업 (선택사항)
-- CREATE TABLE veterinary_students_backup AS 
-- SELECT u.*, vsp.* 
-- FROM users u 
-- JOIN veterinary_student_profiles vsp ON u.id = vsp."userId" 
-- WHERE u."userType" = 'VETERINARY_STUDENT';

-- 2. 외래키 제약조건 제거
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'veterinary_student_profiles_userId_fkey'
        AND table_name = 'veterinary_student_profiles'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "veterinary_student_profiles" 
        DROP CONSTRAINT "veterinary_student_profiles_userId_fkey";
        RAISE NOTICE '✓ 외래키 제약조건 제거됨';
    END IF;
END $$;

-- 3. 수의학과 학생 프로필 테이블 삭제
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'veterinary_student_profiles'
        AND table_schema = 'public'
    ) THEN
        DROP TABLE "veterinary_student_profiles";
        RAISE NOTICE '✓ veterinary_student_profiles 테이블 삭제됨';
    END IF;
END $$;

-- 4. VETERINARY_STUDENT 타입의 사용자 삭제 (주의: 데이터 손실!)
DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM "users" WHERE "userType" = 'VETERINARY_STUDENT';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ % 명의 수의학과 학생 사용자 삭제됨', deleted_count;
END $$;

-- 5. UserType enum에서 VETERINARY_STUDENT 제거
-- 주의: PostgreSQL에서 enum 값을 제거하는 것은 복잡합니다.
-- 대신 새로운 enum을 생성하고 기존 것을 교체합니다.
DO $$
BEGIN
    -- 새로운 UserType enum 생성 (VETERINARY_STUDENT 제외)
    CREATE TYPE "UserType_new" AS ENUM ('VETERINARIAN', 'HOSPITAL');
    
    -- users 테이블의 userType 컬럼을 새로운 타입으로 변경
    ALTER TABLE "users" ALTER COLUMN "userType" TYPE "UserType_new" 
    USING "userType"::text::"UserType_new";
    
    -- 기존 enum 삭제하고 새로운 것을 기존 이름으로 변경
    DROP TYPE "UserType";
    ALTER TYPE "UserType_new" RENAME TO "UserType";
    
    RAISE NOTICE '✓ UserType enum에서 VETERINARY_STUDENT 제거됨';
END $$;

-- 6. 롤백 검증
DO $$
DECLARE
    enum_count INTEGER;
    table_count INTEGER;
    user_count INTEGER;
BEGIN
    -- UserType enum 검증
    SELECT COUNT(*) INTO enum_count
    FROM pg_enum 
    WHERE enumlabel = 'VETERINARY_STUDENT' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserType');
    
    -- 테이블 존재 검증
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_name = 'veterinary_student_profiles' 
    AND table_schema = 'public';
    
    -- 수의학과 학생 사용자 수 확인
    SELECT COUNT(*) INTO user_count
    FROM "users" WHERE "userType"::text = 'VETERINARY_STUDENT';
    
    -- 검증 결과 출력
    RAISE NOTICE '=== 롤백 검증 결과 ===';
    RAISE NOTICE 'UserType enum (VETERINARY_STUDENT): %', 
        CASE WHEN enum_count = 0 THEN '✓ 제거됨' ELSE '✗ 여전히 존재' END;
    RAISE NOTICE 'veterinary_student_profiles 테이블: %', 
        CASE WHEN table_count = 0 THEN '✓ 제거됨' ELSE '✗ 여전히 존재' END;
    RAISE NOTICE '수의학과 학생 사용자: %', 
        CASE WHEN user_count = 0 THEN '✓ 제거됨' ELSE '✗ 여전히 존재' END;
    
    -- 롤백 성공 여부 판단
    IF enum_count = 0 AND table_count = 0 AND user_count = 0 THEN
        RAISE NOTICE '✅ 수의학과 학생 시스템 롤백 완료!';
    ELSE
        RAISE EXCEPTION '❌ 롤백 실패: 일부 구성요소가 여전히 존재함';
    END IF;
END $$;

COMMIT;

-- 롤백 완료 메시지
\echo '✅ 수의학과 학생 시스템 롤백 완료'
\echo '❌ 제거된 구성요소:'
\echo '   - UserType enum: VETERINARY_STUDENT 제거'
\echo '   - 테이블: veterinary_student_profiles 삭제'
\echo '   - 데이터: 모든 수의학과 학생 사용자 삭제'
\echo '⚠️  주의: 이 작업은 되돌릴 수 없습니다!'