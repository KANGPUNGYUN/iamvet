-- 이력서 데이터 확인 쿼리

-- 1. 메인 이력서 테이블 확인
SELECT 
    id,
    "userId",
    name,
    email,
    phone,
    position,
    specialties,
    "preferredRegions",
    "createdAt",
    "updatedAt"
FROM detailed_resumes 
WHERE "deletedAt" IS NULL
ORDER BY "createdAt" DESC;

-- 2. 사용자별 이력서 개수 확인
SELECT 
    COUNT(*) as resume_count,
    COUNT(DISTINCT "userId") as unique_users
FROM detailed_resumes 
WHERE "deletedAt" IS NULL;

-- 3. 경력 정보 확인
SELECT 
    re.id,
    re."resumeId",
    re."hospitalName",
    re."mainTasks",
    re."startDate",
    re."endDate",
    dr.name as resume_owner
FROM resume_experiences re
JOIN detailed_resumes dr ON re."resumeId" = dr.id
ORDER BY re."createdAt" DESC;

-- 4. 자격증/면허 정보 확인
SELECT 
    rl.id,
    rl."resumeId",
    rl.name as license_name,
    rl.issuer,
    rl.grade,
    rl."acquiredDate",
    dr.name as resume_owner
FROM resume_licenses rl
JOIN detailed_resumes dr ON rl."resumeId" = dr.id
ORDER BY rl."createdAt" DESC;

-- 5. 교육 정보 확인
SELECT 
    re.id,
    re."resumeId",
    re.degree,
    re."graduationStatus",
    re."schoolName",
    re.major,
    re.gpa,
    dr.name as resume_owner
FROM resume_educations re
JOIN detailed_resumes dr ON re."resumeId" = dr.id
ORDER BY re."createdAt" DESC;

-- 6. 의료 역량 정보 확인
SELECT 
    rmc.id,
    rmc."resumeId",
    rmc.field,
    rmc.proficiency,
    rmc.description,
    dr.name as resume_owner
FROM resume_medical_capabilities rmc
JOIN detailed_resumes dr ON rmc."resumeId" = dr.id
ORDER BY rmc."createdAt" DESC;

-- 7. 특정 사용자의 완전한 이력서 정보 (사용자 ID를 알고 있는 경우)
-- 아래 쿼리에서 'USER_ID_HERE'를 실제 사용자 ID로 변경하세요
/*
SELECT 
    dr.*,
    (
        SELECT json_agg(
            json_build_object(
                'id', re.id,
                'hospitalName', re."hospitalName",
                'mainTasks', re."mainTasks",
                'startDate', re."startDate",
                'endDate', re."endDate"
            )
        )
        FROM resume_experiences re 
        WHERE re."resumeId" = dr.id
    ) as experiences,
    (
        SELECT json_agg(
            json_build_object(
                'id', rl.id,
                'name', rl.name,
                'issuer', rl.issuer,
                'grade', rl.grade,
                'acquiredDate', rl."acquiredDate"
            )
        )
        FROM resume_licenses rl 
        WHERE rl."resumeId" = dr.id
    ) as licenses,
    (
        SELECT json_agg(
            json_build_object(
                'id', re.id,
                'degree', re.degree,
                'graduationStatus', re."graduationStatus",
                'schoolName', re."schoolName",
                'major', re.major,
                'gpa', re.gpa
            )
        )
        FROM resume_educations re 
        WHERE re."resumeId" = dr.id
    ) as educations,
    (
        SELECT json_agg(
            json_build_object(
                'id', rmc.id,
                'field', rmc.field,
                'proficiency', rmc.proficiency,
                'description', rmc.description
            )
        )
        FROM resume_medical_capabilities rmc 
        WHERE rmc."resumeId" = dr.id
    ) as medical_capabilities
FROM detailed_resumes dr
WHERE dr."userId" = 'USER_ID_HERE' AND dr."deletedAt" IS NULL;
*/

-- 8. 테이블 존재 여부 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%resume%'
ORDER BY table_name;