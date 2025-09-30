# 정규화 마이그레이션 실행 계획

## 🚨 중요: 마이그레이션 전 체크리스트

### 1. 사전 준비 (필수)
- [ ] 데이터베이스 전체 백업 완료
- [ ] 애플리케이션 서비스 일시 중단
- [ ] 마이그레이션 로그 테이블 존재 확인
- [ ] 충분한 디스크 공간 확보

### 2. 환경 확인
- [ ] 데이터베이스 연결 정상
- [ ] 필요한 권한 확인 (CREATE, ALTER, INSERT, UPDATE, DELETE)
- [ ] PostgreSQL 버전 호환성 확인

## 📝 실행 순서

### Step 1: 백업 및 환경 준비
```bash
# 1. 데이터베이스 백업
pg_dump -h localhost -U your_user -d iamvet_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. 백업 파일 검증
ls -la backup_*.sql

# 3. 테스트 환경에서 복원 테스트 (권장)
createdb iamvet_test
psql -h localhost -U your_user -d iamvet_test < backup_YYYYMMDD_HHMMSS.sql
```

### Step 2: 마이그레이션 로그 테이블 생성
```sql
-- migration_log 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS migration_log (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    status VARCHAR(50) DEFAULT 'SUCCESS'
);
```

### Step 3: 정규화 마이그레이션 실행
```bash
# 1. 마이그레이션 스크립트 실행
psql -h localhost -U your_user -d iamvet_db -f prisma/migrations/003_normalize_users_schema.sql

# 2. 실행 결과 확인
echo $?  # 0이면 성공, 그 외는 오류
```

### Step 4: 데이터 검증
```sql
-- 1. 사용자 수 검증
SELECT 
    'VETERINARIAN' as type,
    (SELECT COUNT(*) FROM users WHERE "userType" = 'VETERINARIAN' AND "isActive" = true) as users_count,
    (SELECT COUNT(*) FROM veterinarians) as normalized_count;

SELECT 
    'VETERINARY_STUDENT' as type,
    (SELECT COUNT(*) FROM users WHERE "userType" = 'VETERINARY_STUDENT' AND "isActive" = true) as users_count,
    (SELECT COUNT(*) FROM veterinary_students) as normalized_count;

SELECT 
    'HOSPITAL' as type,
    (SELECT COUNT(*) FROM users WHERE "userType" = 'HOSPITAL' AND "isActive" = true) as users_count,
    (SELECT COUNT(*) FROM hospitals) as normalized_count;

-- 2. 마이그레이션 로그 확인
SELECT * FROM migration_log WHERE migration_name = '003_normalize_users_schema';

-- 3. 새로운 테이블 구조 확인
\d+ veterinarians
\d+ veterinary_students
\d+ hospitals
\d+ hospital_treatment_animals
\d+ hospital_treatment_specialties
```

### Step 5: 애플리케이션 테스트
```bash
# 1. 애플리케이션 시작
npm run dev

# 2. 주요 기능 테스트
# - 로그인 (모든 사용자 유형)
# - 회원가입 (모든 사용자 유형)
# - 프로필 조회/수정
# - 소셜 로그인
```

## 🔧 마이그레이션 스크립트 실행

### 안전한 실행 방법
```bash
# 1. 마이그레이션 스크립트 권한 확인
ls -la prisma/migrations/003_normalize_users_schema.sql

# 2. 스크립트 내용 검토 (선택사항)
head -50 prisma/migrations/003_normalize_users_schema.sql

# 3. 트랜잭션으로 실행 (롤백 가능)
psql -h localhost -U your_user -d iamvet_db -c "
BEGIN;
\i prisma/migrations/003_normalize_users_schema.sql
-- 여기서 데이터 검증
-- 문제가 있으면: ROLLBACK;
-- 정상이면: COMMIT;
"
```

## ⚠️ 롤백 계획

### 문제 발생 시 대응
1. **즉시 롤백**: `ROLLBACK;` (트랜잭션 내에서)
2. **백업 복원**: 
   ```bash
   # 현재 DB 드롭 (주의!)
   dropdb iamvet_db
   # 백업에서 복원
   createdb iamvet_db
   psql -h localhost -U your_user -d iamvet_db < backup_YYYYMMDD_HHMMSS.sql
   ```

### 일반적인 문제들
- **메모리 부족**: 큰 테이블의 경우 배치 처리 필요
- **제약조건 위반**: 데이터 정합성 문제
- **권한 오류**: 사용자 권한 확인
- **디스크 공간 부족**: 충분한 공간 확보

## 📊 예상 소요 시간

| 작업 | 예상 시간 | 비고 |
|------|----------|------|
| 백업 | 5-15분 | DB 크기에 따라 |
| 마이그레이션 실행 | 10-30분 | 데이터 양에 따라 |
| 데이터 검증 | 5-10분 | |
| 애플리케이션 테스트 | 15-30분 | |
| **총 소요 시간** | **35-85분** | |

## 🎯 성공 기준

### 마이그레이션 성공 확인
- [ ] 모든 새로운 테이블이 생성됨
- [ ] 데이터 개수가 일치함
- [ ] 애플리케이션이 정상 동작함
- [ ] 로그인/회원가입이 정상 작동함
- [ ] 프로필 조회/수정이 정상 작동함

### 실패 시 조치
1. 즉시 서비스 중단
2. 백업에서 복원
3. 문제 원인 파악 및 해결
4. 재시도 또는 연기

## 📞 긴급 연락처
- DB 관리자: [연락처]
- 개발팀: [연락처]
- 인프라팀: [연락처]

---

**⚠️ 중요: 이 계획을 프로덕션 환경에서 실행하기 전에 반드시 스테이징 환경에서 전체 과정을 테스트해주세요.**