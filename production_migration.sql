-- 프로덕션 환경 마이그레이션 스크립트
-- 로컬 환경과 동일한 스키마로 배포 환경 업데이트

-- 마이그레이션 실행 전 체크
DO $$
BEGIN
    -- 마이그레이션 로그 테이블 존재 확인
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_log') THEN
        CREATE TABLE migration_log (
            id SERIAL PRIMARY KEY,
            migration_name VARCHAR(255) UNIQUE NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            description TEXT,
            status VARCHAR(50) DEFAULT 'SUCCESS'
        );
    END IF;
    
    -- 이미 실행된 마이그레이션인지 확인
    IF EXISTS (SELECT 1 FROM migration_log WHERE migration_name = 'production_sync_2025') THEN
        RAISE NOTICE 'Migration already executed: production_sync_2025';
        RETURN;
    END IF;
END $$;

-- 1. 수의사 테이블 생성/업데이트
CREATE TABLE IF NOT EXISTS veterinarians (
    id VARCHAR PRIMARY KEY,
    "userId" VARCHAR UNIQUE NOT NULL,
    "realName" VARCHAR NOT NULL,
    "birthDate" TIMESTAMP(6),
    nickname VARCHAR(100),
    "licenseImage" VARCHAR,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- 외래키 제약조건 추가
ALTER TABLE veterinarians 
    DROP CONSTRAINT IF EXISTS fk_veterinarians_user;
ALTER TABLE veterinarians 
    ADD CONSTRAINT fk_veterinarians_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_veterinarians_nickname ON veterinarians(nickname);
CREATE INDEX IF NOT EXISTS idx_veterinarians_userid ON veterinarians("userId");

-- 2. 수의학과 학생 테이블 생성/업데이트
CREATE TABLE IF NOT EXISTS veterinary_students (
    id VARCHAR PRIMARY KEY,
    "userId" VARCHAR UNIQUE NOT NULL,
    "realName" VARCHAR NOT NULL,
    "birthDate" TIMESTAMP(6),
    nickname VARCHAR(100),
    "universityEmail" VARCHAR UNIQUE,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- 외래키 제약조건 추가
ALTER TABLE veterinary_students 
    DROP CONSTRAINT IF EXISTS fk_veterinary_students_user;
ALTER TABLE veterinary_students 
    ADD CONSTRAINT fk_veterinary_students_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_veterinary_students_nickname ON veterinary_students(nickname);
CREATE INDEX IF NOT EXISTS idx_veterinary_students_university_email ON veterinary_students("universityEmail");
CREATE INDEX IF NOT EXISTS idx_veterinary_students_userid ON veterinary_students("userId");

-- 3. 병원 테이블 생성/업데이트
CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR PRIMARY KEY,
    "userId" VARCHAR UNIQUE NOT NULL,
    "hospitalName" VARCHAR NOT NULL,
    "representativeName" VARCHAR NOT NULL,
    "businessNumber" VARCHAR UNIQUE,
    "businessLicenseFile" VARCHAR,
    "establishedDate" TIMESTAMP(6),
    "hospitalAddress" VARCHAR,
    "hospitalAddressDetail" VARCHAR,
    "postalCode" VARCHAR,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    "hospitalLogo" VARCHAR,
    "hospitalWebsite" VARCHAR,
    "hospitalDescription" TEXT,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- 외래키 제약조건 추가
ALTER TABLE hospitals 
    DROP CONSTRAINT IF EXISTS fk_hospitals_user;
ALTER TABLE hospitals 
    ADD CONSTRAINT fk_hospitals_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_hospitals_business_number ON hospitals("businessNumber");
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_hospitals_userid ON hospitals("userId");

-- 4. 병원 이미지 테이블 생성/업데이트
CREATE TABLE IF NOT EXISTS hospital_images (
    id VARCHAR PRIMARY KEY,
    "hospitalId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "imageUrl" VARCHAR NOT NULL,
    "imageOrder" INTEGER NOT NULL,
    "imageDescription" VARCHAR,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- 외래키 제약조건 추가
ALTER TABLE hospital_images 
    DROP CONSTRAINT IF EXISTS fk_hospital_images_hospital;
ALTER TABLE hospital_images 
    ADD CONSTRAINT fk_hospital_images_hospital 
    FOREIGN KEY ("hospitalId") REFERENCES hospitals(id) ON DELETE CASCADE;

ALTER TABLE hospital_images 
    DROP CONSTRAINT IF EXISTS fk_hospital_images_user;
ALTER TABLE hospital_images 
    ADD CONSTRAINT fk_hospital_images_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- 유니크 제약조건 추가
ALTER TABLE hospital_images 
    DROP CONSTRAINT IF EXISTS uk_hospital_image_order;
ALTER TABLE hospital_images 
    ADD CONSTRAINT uk_hospital_image_order 
    UNIQUE ("hospitalId", "imageOrder");

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_hospital_images_hospital ON hospital_images("hospitalId");
CREATE INDEX IF NOT EXISTS idx_hospital_images_order ON hospital_images("hospitalId", "imageOrder");

-- 5. 병원 진료 동물 테이블 생성/업데이트
CREATE TABLE IF NOT EXISTS hospital_treatment_animals (
    id VARCHAR PRIMARY KEY,
    "hospitalId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "animalType" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- 외래키 제약조건 추가
ALTER TABLE hospital_treatment_animals 
    DROP CONSTRAINT IF EXISTS fk_hospital_animals_hospital;
ALTER TABLE hospital_treatment_animals 
    ADD CONSTRAINT fk_hospital_animals_hospital 
    FOREIGN KEY ("hospitalId") REFERENCES hospitals(id) ON DELETE CASCADE;

ALTER TABLE hospital_treatment_animals 
    DROP CONSTRAINT IF EXISTS fk_hospital_animals_user;
ALTER TABLE hospital_treatment_animals 
    ADD CONSTRAINT fk_hospital_animals_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- 유니크 제약조건 추가
ALTER TABLE hospital_treatment_animals 
    DROP CONSTRAINT IF EXISTS uk_hospital_animal;
ALTER TABLE hospital_treatment_animals 
    ADD CONSTRAINT uk_hospital_animal 
    UNIQUE ("hospitalId", "animalType");

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_hospital_treatment_animals_hospital ON hospital_treatment_animals("hospitalId");

-- 6. 병원 진료 전문분야 테이블 생성/업데이트
CREATE TABLE IF NOT EXISTS hospital_treatment_specialties (
    id VARCHAR PRIMARY KEY,
    "hospitalId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    specialty VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- 외래키 제약조건 추가
ALTER TABLE hospital_treatment_specialties 
    DROP CONSTRAINT IF EXISTS fk_hospital_specialties_hospital;
ALTER TABLE hospital_treatment_specialties 
    ADD CONSTRAINT fk_hospital_specialties_hospital 
    FOREIGN KEY ("hospitalId") REFERENCES hospitals(id) ON DELETE CASCADE;

ALTER TABLE hospital_treatment_specialties 
    DROP CONSTRAINT IF EXISTS fk_hospital_specialties_user;
ALTER TABLE hospital_treatment_specialties 
    ADD CONSTRAINT fk_hospital_specialties_user 
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- 유니크 제약조건 추가
ALTER TABLE hospital_treatment_specialties 
    DROP CONSTRAINT IF EXISTS uk_hospital_specialty;
ALTER TABLE hospital_treatment_specialties 
    ADD CONSTRAINT uk_hospital_specialty 
    UNIQUE ("hospitalId", specialty);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_hospital_treatment_specialties_hospital ON hospital_treatment_specialties("hospitalId");

-- 7. 기존 hospital_facility_images를 hospital_images로 마이그레이션
DO $$
BEGIN
    -- hospital_facility_images 테이블이 존재하는 경우에만 마이그레이션
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hospital_facility_images') THEN
        
        -- hospital_facility_images 데이터를 hospital_images로 마이그레이션
        INSERT INTO hospital_images (id, "hospitalId", "userId", "imageUrl", "imageOrder", "imageDescription", "createdAt", "updatedAt")
        SELECT 
            hfi.id,
            h.id as "hospitalId",
            hfi."userId",
            hfi."imageUrl",
            hfi."imageOrder",
            hfi."imageDescription",
            hfi."createdAt",
            hfi."updatedAt"
        FROM hospital_facility_images hfi
        JOIN hospitals h ON h."userId" = hfi."userId"
        WHERE NOT EXISTS (
            SELECT 1 FROM hospital_images hi WHERE hi.id = hfi.id
        );
        
        -- hospital_facility_images 테이블 제거
        DROP TABLE IF EXISTS hospital_facility_images CASCADE;
        
        RAISE NOTICE 'Migrated hospital_facility_images to hospital_images';
    END IF;
END $$;

-- 8. users 테이블에서 기존 데이터 마이그레이션
DO $$
DECLARE
    user_record RECORD;
    new_id VARCHAR;
BEGIN
    -- 수의사 데이터 마이그레이션
    FOR user_record IN 
        SELECT * FROM users 
        WHERE "userType" = 'VETERINARIAN' 
        AND "isActive" = true 
        AND NOT EXISTS (SELECT 1 FROM veterinarians WHERE "userId" = users.id)
    LOOP
        new_id := 'vet_' || user_record.id || '_' || EXTRACT(EPOCH FROM NOW())::bigint;
        
        INSERT INTO veterinarians (id, "userId", "realName", "birthDate", nickname, "licenseImage")
        VALUES (
            new_id,
            user_record.id,
            COALESCE(user_record."realName", '미입력'),
            user_record."birthDate",
            user_record.nickname,
            user_record."licenseImage"
        );
    END LOOP;
    
    -- 수의학과 학생 데이터 마이그레이션
    FOR user_record IN 
        SELECT * FROM users 
        WHERE "userType" = 'VETERINARY_STUDENT' 
        AND "isActive" = true 
        AND NOT EXISTS (SELECT 1 FROM veterinary_students WHERE "userId" = users.id)
    LOOP
        new_id := 'vs_' || user_record.id || '_' || EXTRACT(EPOCH FROM NOW())::bigint;
        
        INSERT INTO veterinary_students (id, "userId", "realName", "birthDate", nickname, "universityEmail")
        VALUES (
            new_id,
            user_record.id,
            COALESCE(user_record."realName", '미입력'),
            user_record."birthDate",
            user_record.nickname,
            user_record."universityEmail"
        );
    END LOOP;
    
    -- 병원 데이터 마이그레이션
    FOR user_record IN 
        SELECT * FROM users 
        WHERE "userType" = 'HOSPITAL' 
        AND "isActive" = true 
        AND NOT EXISTS (SELECT 1 FROM hospitals WHERE "userId" = users.id)
    LOOP
        new_id := 'hosp_' || user_record.id || '_' || EXTRACT(EPOCH FROM NOW())::bigint;
        
        INSERT INTO hospitals (
            id, "userId", "hospitalName", "representativeName", "businessNumber", 
            "businessLicenseFile", "establishedDate", "hospitalAddress", 
            "hospitalAddressDetail", "hospitalLogo", "hospitalWebsite"
        )
        VALUES (
            new_id,
            user_record.id,
            COALESCE(user_record."hospitalName", '미입력 병원'),
            COALESCE(user_record."realName", '미입력'),
            user_record."businessNumber",
            user_record."businessLicenseFile",
            user_record."establishedDate",
            user_record."hospitalAddress",
            user_record."hospitalAddressDetail",
            user_record."hospitalLogo",
            user_record."hospitalWebsite"
        );
    END LOOP;
    
    RAISE NOTICE 'Data migration completed';
END $$;

-- 9. users 테이블에 loginId 컬럼 추가 (없는 경우)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'loginId'
    ) THEN
        ALTER TABLE users ADD COLUMN "loginId" VARCHAR(100) UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_users_loginid ON users("loginId");
        
        -- 기존 이메일을 loginId로 복사
        UPDATE users SET "loginId" = email WHERE "loginId" IS NULL;
        
        RAISE NOTICE 'Added loginId column to users table';
    END IF;
END $$;

-- 10. lecture_comments 테이블에 parentId 컬럼 추가 (없는 경우)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lecture_comments' AND column_name = 'parentId'
    ) THEN
        ALTER TABLE lecture_comments ADD COLUMN "parentId" VARCHAR(255);
        
        -- 외래키 제약조건 추가
        ALTER TABLE lecture_comments 
            ADD CONSTRAINT fk_lecture_comment_parent 
            FOREIGN KEY ("parentId") REFERENCES lecture_comments(id) ON DELETE CASCADE;
        
        -- 인덱스 추가
        CREATE INDEX IF NOT EXISTS idx_lecture_comments_parent_id ON lecture_comments("parentId");
        
        RAISE NOTICE 'Added parentId column to lecture_comments table';
    END IF;
END $$;

-- 11. lectures 테이블에 instructor 컬럼 추가 (없는 경우)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lectures' AND column_name = 'instructor'
    ) THEN
        ALTER TABLE lectures ADD COLUMN instructor VARCHAR(255);
        
        RAISE NOTICE 'Added instructor column to lectures table';
    END IF;
END $$;

-- 12. 마이그레이션 완료 로그
INSERT INTO migration_log (migration_name, description, executed_at) 
VALUES (
    'production_sync_2025', 
    'Synchronized production database with local schema including normalized user tables', 
    CURRENT_TIMESTAMP
) ON CONFLICT (migration_name) DO NOTHING;

-- 데이터 검증 쿼리 실행
DO $$
DECLARE
    vet_users_count INTEGER;
    vet_normalized_count INTEGER;
    student_users_count INTEGER;
    student_normalized_count INTEGER;
    hospital_users_count INTEGER;
    hospital_normalized_count INTEGER;
BEGIN
    -- 수의사 데이터 검증
    SELECT COUNT(*) INTO vet_users_count FROM users WHERE "userType" = 'VETERINARIAN' AND "isActive" = true;
    SELECT COUNT(*) INTO vet_normalized_count FROM veterinarians;
    
    -- 수의학과 학생 데이터 검증
    SELECT COUNT(*) INTO student_users_count FROM users WHERE "userType" = 'VETERINARY_STUDENT' AND "isActive" = true;
    SELECT COUNT(*) INTO student_normalized_count FROM veterinary_students;
    
    -- 병원 데이터 검증
    SELECT COUNT(*) INTO hospital_users_count FROM users WHERE "userType" = 'HOSPITAL' AND "isActive" = true;
    SELECT COUNT(*) INTO hospital_normalized_count FROM hospitals;
    
    RAISE NOTICE 'Migration Verification:';
    RAISE NOTICE 'Veterinarians - Users: %, Normalized: %', vet_users_count, vet_normalized_count;
    RAISE NOTICE 'Students - Users: %, Normalized: %', student_users_count, student_normalized_count;
    RAISE NOTICE 'Hospitals - Users: %, Normalized: %', hospital_users_count, hospital_normalized_count;
    
    IF vet_users_count = vet_normalized_count AND 
       student_users_count = student_normalized_count AND 
       hospital_users_count = hospital_normalized_count THEN
        RAISE NOTICE 'SUCCESS: All data migrated correctly!';
    ELSE
        RAISE WARNING 'WARNING: Data count mismatch detected!';
    END IF;
END $$;

RAISE NOTICE 'Production migration completed successfully!';