# 사용자 테이블 정규화 마이그레이션 가이드

## 개요
이 마이그레이션은 `users` 테이블에서 사용자 유형별 특화 데이터를 분리하여 정규화된 스키마로 변경합니다.

## 변경 사항

### 1. 새로 생성되는 테이블들

#### `veterinarians` (수의사 전용)
- `id` - Primary Key
- `userId` - users 테이블 참조 (UNIQUE)
- `realName` - 실명
- `birthDate` - 생년월일  
- `nickname` - 닉네임
- `licenseImage` - 면허증 이미지

#### `veterinary_students` (수의학과 학생 전용)
- `id` - Primary Key
- `userId` - users 테이블 참조 (UNIQUE)
- `realName` - 실명
- `birthDate` - 생년월일
- `nickname` - 닉네임
- `universityEmail` - 대학교 이메일

#### `hospitals` (병원 전용)
- `id` - Primary Key
- `userId` - users 테이블 참조 (UNIQUE)
- `hospitalName` - 병원명
- `representativeName` - 대표자명
- `businessNumber` - 사업자등록번호
- `businessLicenseFile` - 사업자등록증 파일
- `establishedDate` - 설립일
- `hospitalAddress` - 주소
- `hospitalAddressDetail` - 상세주소
- `postalCode` - 우편번호
- `latitude`, `longitude` - 위도, 경도
- `hospitalLogo` - 병원 로고
- `hospitalWebsite` - 병원 웹사이트
- `hospitalDescription` - 병원 설명

#### `hospital_images` (병원 이미지 모음)
- `id` - Primary Key
- `hospitalId` - hospitals 테이블 참조
- `userId` - users 테이블 참조
- `imageUrl` - 이미지 URL
- `imageOrder` - 이미지 순서 (1-10)
- `imageDescription` - 이미지 설명

#### `hospital_treatment_animals` (진료 가능 동물)
- `id` - Primary Key
- `hospitalId` - hospitals 테이블 참조
- `userId` - users 테이블 참조
- `animalType` - 동물 종류

#### `hospital_treatment_specialties` (진료 전문 분야)
- `id` - Primary Key
- `hospitalId` - hospitals 테이블 참조
- `userId` - users 테이블 참조
- `specialty` - 전문 분야

### 2. users 테이블에 남아있는 공통 필드들
- `id` - Primary Key
- `loginId` - 로그인 아이디 (UNIQUE)
- `email` - 이메일 (UNIQUE)
- `phone` - 전화번호 (UNIQUE)
- `passwordHash` - 비밀번호 해시
- `profileImage` - 프로필 이미지
- `userType` - 사용자 유형
- `provider` - 로그인 제공자
- `isActive` - 활성 상태
- `termsAgreedAt` - 이용약관 동의 시간
- `privacyAgreedAt` - 개인정보 동의 시간
- `marketingAgreedAt` - 마케팅 동의 시간
- `deletedAt` - 삭제 시간
- `withdrawReason` - 탈퇴 사유
- `restoredAt` - 복구 시간
- `createdAt` - 생성 시간
- `updatedAt` - 수정 시간
- `lastLoginAt` - 마지막 로그인 시간
- `seq` - 시퀀스 번호

### 3. users 테이블에서 제거되는 필드들
- `realName` → 각 사용자 유형별 테이블로 이동
- `birthDate` → 각 사용자 유형별 테이블로 이동
- `nickname` → 각 사용자 유형별 테이블로 이동
- `licenseImage` → veterinarians 테이블로 이동
- `universityEmail` → veterinary_students 테이블로 이동
- `hospitalName` → hospitals 테이블로 이동
- `businessNumber` → hospitals 테이블로 이동
- `establishedDate` → hospitals 테이블로 이동
- `hospitalAddress` → hospitals 테이블로 이동
- `hospitalAddressDetail` → hospitals 테이블로 이동
- `hospitalLogo` → hospitals 테이블로 이동
- `hospitalWebsite` → hospitals 테이블로 이동

## 마이그레이션 실행 순서

### 1단계: 정규화 테이블 생성 및 데이터 마이그레이션
```bash
psql -d your_database -f prisma/migrations/003_normalize_users_schema.sql
```

### 2단계: 데이터 검증
마이그레이션 후 다음 쿼리로 데이터가 올바르게 이동되었는지 확인:

```sql
-- 수의사 데이터 검증
SELECT 
  (SELECT COUNT(*) FROM users WHERE "userType" = 'VETERINARIAN' AND "isActive" = true) as users_count,
  (SELECT COUNT(*) FROM veterinarians) as veterinarians_count;

-- 수의학과 학생 데이터 검증  
SELECT 
  (SELECT COUNT(*) FROM users WHERE "userType" = 'VETERINARY_STUDENT' AND "isActive" = true) as users_count,
  (SELECT COUNT(*) FROM veterinary_students) as students_count;

-- 병원 데이터 검증
SELECT 
  (SELECT COUNT(*) FROM users WHERE "userType" = 'HOSPITAL' AND "isActive" = true) as users_count,
  (SELECT COUNT(*) FROM hospitals) as hospitals_count;
```

### 3단계: 애플리케이션 코드 업데이트
- API 엔드포인트 수정 완료
- 회원가입 로직 수정 완료
- 사용자 조회/수정 로직 수정 완료

### 4단계: users 테이블 정리 (선택사항)
데이터 검증이 완료되고 애플리케이션이 안정적으로 동작하는 것을 확인한 후:

```bash
psql -d your_database -f prisma/migrations/004_cleanup_users_table.sql
```

## 롤백 방법

문제가 발생한 경우:

1. **코드 롤백**: Git을 통해 이전 버전으로 되돌리기
2. **데이터베이스 롤백**: 백업된 데이터로 복구
3. **정규화 테이블 제거**:
   ```sql
   DROP TABLE IF EXISTS hospital_treatment_specialties;
   DROP TABLE IF EXISTS hospital_treatment_animals;
   DROP TABLE IF EXISTS hospital_images;
   DROP TABLE IF EXISTS hospitals;
   DROP TABLE IF EXISTS veterinary_students;
   DROP TABLE IF EXISTS veterinarians;
   ```

## 주의사항

1. **백업 필수**: 마이그레이션 전 반드시 데이터베이스 전체 백업
2. **점진적 적용**: 프로덕션 환경에서는 단계별로 신중하게 적용
3. **테스트 환경 우선**: 개발/스테이징 환경에서 충분히 테스트 후 적용
4. **다운타임 고려**: 마이그레이션 중 서비스 중단 시간 계획
5. **모니터링**: 마이그레이션 후 애플리케이션 성능 및 오류 모니터링

## 장점

1. **데이터 정규화**: 중복 데이터 제거 및 데이터 무결성 향상
2. **확장성**: 사용자 유형별 독립적인 기능 확장 가능
3. **성능**: 사용자 유형별 최적화된 쿼리 성능
4. **유지보수성**: 도메인별 명확한 책임 분리

## 영향받는 API 엔드포인트

- ✅ `registerVeterinarian` - 수정 완료
- ✅ `registerVeterinaryStudent` - 수정 완료  
- ✅ `registerHospital` - 수정 완료
- ✅ `getCurrentUser` - 수정 완료
- ✅ `getVeterinarianProfile` - 수정 완료
- ✅ `getHospitalProfile` - 수정 완료
- ✅ `updateVeterinarianProfile` - 수정 완료
- ✅ `getDetailedHospitalProfile` - 수정 완료
- ✅ `saveDetailedHospitalProfile` - 수정 완료

모든 API가 정규화된 스키마에 맞게 수정되었습니다.