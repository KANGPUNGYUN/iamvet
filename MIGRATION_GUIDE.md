# 데이터베이스 부분 반정규화 마이그레이션 가이드

## 개요
이 가이드는 iamvet 프로젝트의 데이터베이스를 정규화된 구조에서 부분 반정규화된 구조로 안전하게 마이그레이션하는 방법을 설명합니다.

## 변경 사항 요약

### 🔄 구조 변경
- **기존**: `users` + `veterinarian_profiles` + `hospital_profiles` + `veterinary_student_profiles` (정규화)
- **신규**: 통합 `users` 테이블 + 별도 상세 정보 테이블들 (부분 반정규화)

### 📋 새로운 회원가입 요구사항
1. **수의사**: 아이디, 비밀번호, 프로필 이미지, 닉네임, 연락처, 이메일, 생년월일, 수의사 면허증, 약관동의
2. **수의학과 학생**: 아이디, 비밀번호, 프로필 이미지, 닉네임, 연락처, 수의학과 인증 대학 이메일, 생년월일, 수의사 면허증(옵션), 약관동의
3. **병원**: 아이디, 비밀번호, 병원명, 병원 설립일, 사업자등록번호, 대표 연락처, 대표 이메일, 병원 웹사이트, 병원 로고, 병원 시설 이미지(최대 10장), 진료 가능 동물, 진료 분야, 병원 주소, 사업자등록증 파일, 약관동의

## 마이그레이션 실행 순서

### 1. 사전 준비
```bash
# 1. 데이터베이스 백업
pg_dump -h localhost -U your_user -d iamvet_db > backup_before_migration.sql

# 2. 애플리케이션 중단 (다운타임 시작)
pm2 stop iamvet

# 3. 마이그레이션 파일 권한 확인
chmod +x prisma/migrations/*.sql
```

### 2. 마이그레이션 실행
```bash
# 1단계: 스키마 변경 및 데이터 이전
psql -h localhost -U your_user -d iamvet_db -f prisma/migrations/001_denormalize_users_schema.sql

# 2단계: 새로운 함수 및 트리거 생성
psql -h localhost -U your_user -d iamvet_db -f prisma/migrations/002_create_new_signup_functions.sql

# 3단계: Prisma 스키마 동기화
npx prisma db push

# 4단계: Prisma 클라이언트 재생성
npx prisma generate
```

### 3. 데이터 검증
```sql
-- 마이그레이션 후 데이터 무결성 확인
SELECT 
  "userType",
  COUNT(*) as total,
  COUNT(CASE WHEN "loginId" IS NOT NULL THEN 1 END) as with_login_id,
  COUNT(CASE WHEN nickname IS NOT NULL AND "userType" IN ('VETERINARIAN', 'VETERINARY_STUDENT') THEN 1 END) as with_nickname,
  COUNT(CASE WHEN "hospitalName" IS NOT NULL AND "userType" = 'HOSPITAL' THEN 1 END) as with_hospital_name
FROM users 
WHERE "isActive" = true 
GROUP BY "userType";

-- 필수 필드 누락 확인
SELECT id, "userType", email, phone, "realName" 
FROM users 
WHERE "isActive" = true 
  AND (email IS NULL OR phone IS NULL OR "realName" IS NULL)
LIMIT 10;
```

### 4. 애플리케이션 재시작
```bash
# 애플리케이션 시작
npm run build
pm2 start iamvet

# 로그 확인
pm2 logs iamvet
```

## 롤백 절차

만약 마이그레이션 중 문제가 발생한 경우:

```sql
-- 1. 트랜잭션 롤백 (마이그레이션 중단된 경우)
ROLLBACK;

-- 2. 완전 롤백 (마이그레이션 완료 후 문제 발견된 경우)
BEGIN;

-- 원본 데이터 복원
TRUNCATE users;
INSERT INTO users SELECT * FROM backup_users;

-- 프로필 테이블 복원
UPDATE veterinarian_profiles SET "deletedAt" = NULL WHERE "deletedAt" IS NOT NULL;
UPDATE hospital_profiles SET "deletedAt" = NULL WHERE "deletedAt" IS NOT NULL;
UPDATE veterinary_student_profiles SET "deletedAt" = NULL WHERE "deletedAt" IS NOT NULL;

-- 백업 테이블 정리
DROP TABLE IF EXISTS backup_users;
DROP TABLE IF EXISTS backup_veterinarian_profiles;
DROP TABLE IF EXISTS backup_hospital_profiles;
DROP TABLE IF EXISTS backup_veterinary_student_profiles;

-- 새로 추가된 테이블 삭제
DROP TABLE IF EXISTS hospital_facility_images;
DROP TABLE IF EXISTS hospital_animals;
DROP TABLE IF EXISTS hospital_specialties;
DROP TABLE IF EXISTS hospital_business_licenses;

-- 새로 추가된 함수들 삭제
DROP FUNCTION IF EXISTS validate_user_required_fields();
DROP FUNCTION IF EXISTS check_duplicate_login_id(TEXT, TEXT);
DROP FUNCTION IF EXISTS check_duplicate_email(TEXT, TEXT);
DROP FUNCTION IF EXISTS check_duplicate_phone(TEXT, TEXT);
DROP FUNCTION IF EXISTS check_duplicate_business_number(TEXT, TEXT);
DROP FUNCTION IF EXISTS check_duplicate_university_email(TEXT, TEXT);
DROP FUNCTION IF EXISTS get_profile_completeness(TEXT);
DROP FUNCTION IF EXISTS validate_university_email_domain(TEXT);

-- 뷰 삭제
DROP VIEW IF EXISTS user_signup_stats;

COMMIT;
```

## 마이그레이션 후 확인사항

### ✅ 체크리스트
- [ ] 모든 기존 사용자 데이터가 새로운 구조로 이전되었는지 확인
- [ ] 회원가입 플로우가 정상 동작하는지 테스트
- [ ] 로그인 기능이 정상 동작하는지 테스트
- [ ] SNS 로그인이 정상 동작하는지 테스트
- [ ] 프로필 조회/수정 기능이 정상 동작하는지 테스트
- [ ] 파일 업로드 기능이 정상 동작하는지 테스트
- [ ] 데이터베이스 성능 모니터링

### 🔍 성능 확인
```sql
-- 인덱스 사용률 확인
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'users'
ORDER BY idx_scan DESC;

-- 사용자 프로필 완성도 확인
SELECT * FROM user_signup_stats;
```

## 주의사항

### ⚠️ 중요 사항
1. **다운타임**: 마이그레이션 중 서비스 중단 필요 (예상 시간: 5-10분)
2. **백업 필수**: 마이그레이션 전 반드시 데이터베이스 백업
3. **스테이징 테스트**: 프로덕션 적용 전 스테이징 환경에서 테스트
4. **모니터링**: 마이그레이션 후 24시간 동안 면밀한 모니터링

### 📞 문제 발생 시 대응
1. 즉시 롤백 절차 실행
2. 백업 데이터로 복구
3. 로그 분석 및 이슈 파악
4. 필요시 개발팀 연락

## 마이그레이션 완료 후 작업

### 🧹 정리 작업 (마이그레이션 안정화 후 1주일 뒤)
```sql
-- 백업 테이블 삭제 (안정화 확인 후)
DROP TABLE IF EXISTS backup_users;
DROP TABLE IF EXISTS backup_veterinarian_profiles;
DROP TABLE IF EXISTS backup_hospital_profiles;
DROP TABLE IF EXISTS backup_veterinary_student_profiles;
```

### 📊 모니터링 대시보드 업데이트
- 새로운 회원가입 통계 반영
- 사용자 유형별 분석 지표 업데이트
- 성능 메트릭 추가

이 가이드를 따라 안전하게 마이그레이션을 진행하시기 바랍니다.