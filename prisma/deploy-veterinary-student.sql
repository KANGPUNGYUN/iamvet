-- 실제 배포용 SQL 스크립트
-- 수의학과 학생 회원 유형 및 프로필 시스템 배포
-- 실행 시간: 2025-09-11

BEGIN;

-- 1. UserType enum에 VETERINARY_STUDENT 추가 (이미 존재하지 않는 경우에만)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'VETERINARY_STUDENT' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserType')
    ) THEN
        ALTER TYPE "UserType" ADD VALUE 'VETERINARY_STUDENT';
        RAISE NOTICE 'Added VETERINARY_STUDENT to UserType enum';
    ELSE
        RAISE NOTICE 'VETERINARY_STUDENT already exists in UserType enum';
    END IF;
END
$$;

-- 2. 실명 필드 추가 (이전 마이그레이션 실패 대응)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'realName'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "realName" VARCHAR;
        RAISE NOTICE 'Added realName column to users table';
    ELSE
        RAISE NOTICE 'realName column already exists in users table';
    END IF;
END $$;

-- 3. 수의학과 학생 프로필 테이블 생성 (이미 존재하지 않는 경우에만)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'veterinary_student_profiles'
        AND table_schema = 'public'
    ) THEN
        CREATE TABLE "veterinary_student_profiles" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "nickname" TEXT NOT NULL,
            "birthDate" TIMESTAMP(3),
            "universityEmail" TEXT NOT NULL,
            "university" TEXT,
            "major" TEXT,
            "admissionYear" INTEGER,
            "currentYear" INTEGER,
            "introduction" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "deletedAt" TIMESTAMP(3),

            CONSTRAINT "veterinary_student_profiles_pkey" PRIMARY KEY ("id")
        );
        
        RAISE NOTICE 'Created veterinary_student_profiles table';
    ELSE
        RAISE NOTICE 'veterinary_student_profiles table already exists';
    END IF;
END $$;

-- 4. 인덱스 생성 (이미 존재하지 않는 경우에만)
DO $$
BEGIN
    -- userId 유니크 인덱스
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'veterinary_student_profiles_userId_key' 
        AND n.nspname = 'public'
    ) THEN
        CREATE UNIQUE INDEX "veterinary_student_profiles_userId_key" 
        ON "veterinary_student_profiles"("userId");
        RAISE NOTICE 'Created userId unique index';
    END IF;

    -- universityEmail 유니크 인덱스
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'veterinary_student_profiles_universityEmail_key' 
        AND n.nspname = 'public'
    ) THEN
        CREATE UNIQUE INDEX "veterinary_student_profiles_universityEmail_key" 
        ON "veterinary_student_profiles"("universityEmail");
        RAISE NOTICE 'Created universityEmail unique index';
    END IF;
END $$;

-- 5. 외래키 제약조건 추가 (이미 존재하지 않는 경우에만)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'veterinary_student_profiles_userId_fkey'
        AND table_name = 'veterinary_student_profiles'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "veterinary_student_profiles" 
        ADD CONSTRAINT "veterinary_student_profiles_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
        RAISE NOTICE 'Created userId foreign key constraint';
    ELSE
        RAISE NOTICE 'userId foreign key constraint already exists';
    END IF;
END $$;

-- 6. 테이블 및 컬럼 코멘트 추가
DO $$
BEGIN
    -- 테이블 코멘트
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'veterinary_student_profiles') THEN
        COMMENT ON TABLE "veterinary_student_profiles" IS '수의학과 학생 프로필 정보';
        COMMENT ON COLUMN "veterinary_student_profiles"."id" IS '프로필 고유 ID';
        COMMENT ON COLUMN "veterinary_student_profiles"."userId" IS '연결된 사용자 ID';
        COMMENT ON COLUMN "veterinary_student_profiles"."nickname" IS '사용자 닉네임';
        COMMENT ON COLUMN "veterinary_student_profiles"."birthDate" IS '생년월일';
        COMMENT ON COLUMN "veterinary_student_profiles"."universityEmail" IS '인증된 대학교 이메일 주소';
        COMMENT ON COLUMN "veterinary_student_profiles"."university" IS '소속 대학교명';
        COMMENT ON COLUMN "veterinary_student_profiles"."major" IS '전공 (수의학과 등)';
        COMMENT ON COLUMN "veterinary_student_profiles"."admissionYear" IS '입학년도';
        COMMENT ON COLUMN "veterinary_student_profiles"."currentYear" IS '현재 학년';
        COMMENT ON COLUMN "veterinary_student_profiles"."introduction" IS '자기소개';
        COMMENT ON COLUMN "veterinary_student_profiles"."createdAt" IS '프로필 생성일시';
        COMMENT ON COLUMN "veterinary_student_profiles"."updatedAt" IS '프로필 수정일시';
        COMMENT ON COLUMN "veterinary_student_profiles"."deletedAt" IS '프로필 삭제일시 (소프트 삭제)';
        
        RAISE NOTICE 'Added table and column comments';
    END IF;
END $$;

-- 7. 배포 검증 쿼리
DO $$
DECLARE
    enum_count INTEGER;
    table_count INTEGER;
    index_count INTEGER;
    constraint_count INTEGER;
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
    
    -- 인덱스 검증
    SELECT COUNT(*) INTO index_count
    FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE c.relname IN ('veterinary_student_profiles_userId_key', 'veterinary_student_profiles_universityEmail_key')
    AND n.nspname = 'public';
    
    -- 제약조건 검증
    SELECT COUNT(*) INTO constraint_count
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'veterinary_student_profiles_userId_fkey'
    AND table_name = 'veterinary_student_profiles'
    AND table_schema = 'public';
    
    -- 검증 결과 출력
    RAISE NOTICE '=== 배포 검증 결과 ===';
    RAISE NOTICE 'UserType enum (VETERINARY_STUDENT): %', 
        CASE WHEN enum_count > 0 THEN '✓ 존재' ELSE '✗ 누락' END;
    RAISE NOTICE 'veterinary_student_profiles 테이블: %', 
        CASE WHEN table_count > 0 THEN '✓ 존재' ELSE '✗ 누락' END;
    RAISE NOTICE '유니크 인덱스: % / 2', index_count;
    RAISE NOTICE '외래키 제약조건: %', 
        CASE WHEN constraint_count > 0 THEN '✓ 존재' ELSE '✗ 누락' END;
    
    -- 배포 성공 여부 판단
    IF enum_count > 0 AND table_count > 0 AND index_count = 2 AND constraint_count > 0 THEN
        RAISE NOTICE '🎉 수의학과 학생 시스템 배포 완료!';
    ELSE
        RAISE EXCEPTION '❌ 배포 실패: 일부 구성요소가 누락됨';
    END IF;
END $$;

COMMIT;

-- 배포 완료 메시지
\echo '✅ 수의학과 학생 회원 시스템 배포 완료'
\echo '📊 생성된 구성요소:'
\echo '   - UserType enum: VETERINARY_STUDENT 추가'
\echo '   - 테이블: veterinary_student_profiles'
\echo '   - 인덱스: userId, universityEmail 유니크 인덱스'
\echo '   - 제약조건: 외래키 제약조건'
\echo '   - 코멘트: 테이블 및 컬럼 설명'