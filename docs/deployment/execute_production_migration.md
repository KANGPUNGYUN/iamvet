# 프로덕션 환경 마이그레이션 실행 가이드

## 🚨 중요: 실행 전 필수 체크리스트

### 1. 사전 준비
- [ ] 프로덕션 데이터베이스 전체 백업 완료
- [ ] 애플리케이션 서비스 일시 중단 계획 수립
- [ ] 충분한 디스크 공간 확보 (최소 2배 이상)
- [ ] 데이터베이스 관리자 대기

### 2. 환경 확인
- [ ] PostgreSQL 서버 연결 상태 정상
- [ ] 데이터베이스 사용자 권한 확인 (CREATE, ALTER, INSERT, UPDATE, DELETE)
- [ ] 네트워크 연결 안정성 확인

## 📋 실행 단계

### Step 1: 데이터베이스 백업
```bash
# 백업 생성 (타임스탬프 포함)
pg_dump -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE > backup_production_$(date +%Y%m%d_%H%M%S).sql

# 백업 파일 크기 확인
ls -lh backup_production_*.sql

# 백업 파일 유효성 검증 (선택사항)
head -20 backup_production_*.sql
```

### Step 2: 마이그레이션 스크립트 실행
```bash
# 1. 스크립트 실행 권한 확인
chmod +x production_migration.sql

# 2. 마이그레이션 실행 (안전한 트랜잭션 방식)
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -v ON_ERROR_STOP=1 -f production_migration.sql

# 3. 실행 결과 확인
echo "Exit code: $?"
```

### Step 3: 데이터 검증
마이그레이션 실행 후 다음 쿼리들로 데이터 무결성 확인:

```sql
-- 1. 마이그레이션 로그 확인
SELECT * FROM migration_log WHERE migration_name = 'production_sync_2025';

-- 2. 사용자 수 검증
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

-- 3. 테이블 구조 확인
\d+ veterinarians
\d+ veterinary_students  
\d+ hospitals
\d+ hospital_images
\d+ hospital_treatment_animals
\d+ hospital_treatment_specialties

-- 4. 외래키 제약조건 확인
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('veterinarians', 'veterinary_students', 'hospitals', 'hospital_images', 'hospital_treatment_animals', 'hospital_treatment_specialties');
```

### Step 4: 애플리케이션 테스트
```bash
# 1. 애플리케이션 재시작
npm run build
npm start

# 2. 주요 기능 테스트
curl -X GET "https://your-domain/api/auth/me" -H "Cookie: auth-token=YOUR_TOKEN"
curl -X GET "https://your-domain/api/users/profile" -H "Cookie: auth-token=YOUR_TOKEN"

# 3. 헬스체크 확인
curl -X GET "https://your-domain/api/health"
```

## 🔄 롤백 계획

### 문제 발생 시 즉시 대응
```bash
# 1. 서비스 즉시 중단
# 2. 백업에서 복원
psql -h YOUR_HOST -U YOUR_USER -c "DROP DATABASE YOUR_DATABASE;"
psql -h YOUR_HOST -U YOUR_USER -c "CREATE DATABASE YOUR_DATABASE;"
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE < backup_production_YYYYMMDD_HHMMSS.sql

# 3. 이전 버전 애플리케이션 배포
git checkout PREVIOUS_COMMIT_HASH
npm run build
npm start
```

## ⏱️ 예상 소요 시간

| 작업 단계 | 예상 시간 | 비고 |
|-----------|----------|------|
| 백업 생성 | 5-20분 | DB 크기에 따라 |
| 마이그레이션 실행 | 10-30분 | 데이터 양에 따라 |
| 데이터 검증 | 5-10분 | |
| 애플리케이션 테스트 | 10-20분 | |
| **총 소요 시간** | **30-80분** | |

## ✅ 성공 기준

### 마이그레이션 성공 확인
- [ ] 모든 새로운 테이블이 정상 생성됨
- [ ] 데이터 개수가 users 테이블과 일치함
- [ ] 외래키 제약조건이 정상 작동함
- [ ] 애플리케이션이 오류 없이 시작됨
- [ ] 로그인/회원가입이 정상 작동함
- [ ] 사용자 프로필 조회/수정이 정상 작동함

### 테스트해야 할 주요 기능
1. **인증 관련**
   - 모든 사용자 타입으로 로그인
   - 회원가입 (수의사, 학생, 병원)
   - 소셜 로그인

2. **프로필 관련**
   - 프로필 조회
   - 프로필 수정
   - 병원 이미지 업로드/조회

3. **핵심 기능**
   - 채용공고 등록/조회
   - 이력서 등록/조회  
   - 댓글 작성/조회

## 🚨 주의사항

1. **백업은 필수**: 반드시 실행 전 완전한 백업 생성
2. **단계별 검증**: 각 단계마다 결과 확인 후 다음 단계 진행
3. **트래픽 고려**: 트래픽이 적은 시간대에 실행
4. **모니터링**: 마이그레이션 후 24시간 집중 모니터링
5. **팀 대기**: 개발팀, 인프라팀 대기 상태 유지

## 📞 긴급 연락처

- **DB 관리자**: [연락처 입력]
- **백엔드 개발자**: [연락처 입력]  
- **인프라 팀**: [연락처 입력]
- **프로젝트 매니저**: [연락처 입력]

---

## 마이그레이션 실행 명령어 요약

```bash
# 1. 백업
pg_dump -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE > backup_production_$(date +%Y%m%d_%H%M%S).sql

# 2. 마이그레이션 실행  
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -v ON_ERROR_STOP=1 -f production_migration.sql

# 3. 검증
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -c "SELECT * FROM migration_log WHERE migration_name = 'production_sync_2025';"
```

**⚠️ 중요: 프로덕션 환경에서 실행하기 전에 반드시 스테이징 환경에서 전체 과정을 테스트하세요!**