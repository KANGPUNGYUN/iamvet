# 수의학과 학생 시스템 배포 가이드

## 개요
이 문서는 수의학과 학생 회원 유형 및 관련 시스템을 실제 운영 환경에 배포하는 방법을 설명합니다.

## 🎯 배포 내용
- **회원 유형**: `VETERINARY_STUDENT` 추가
- **데이터베이스**: 수의학과 학생 프로필 테이블 및 관련 스키마
- **인증**: 대학교 이메일 기반 회원 인증 시스템
- **UI**: 회원가입/로그인 페이지 및 관련 컴포넌트

## 📋 배포 전 체크리스트

### 1. 환경 변수 확인
```bash
# 필수 환경 변수
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region

# 클라이언트 사이드 환경 변수
NEXT_PUBLIC_S3_BUCKET_NAME=your-bucket
NEXT_PUBLIC_AWS_REGION=your-region
```

### 2. 데이터베이스 백업
```bash
# 배포 전 반드시 백업 수행
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3. 빌드 테스트
```bash
npm run build
```

## 🚀 배포 실행

### 방법 1: 자동 배포 스크립트 (권장)
```bash
# 스크립트 실행 권한 확인
chmod +x scripts/deploy-database.sh

# 배포 실행
./scripts/deploy-database.sh
```

### 방법 2: 수동 배포
```bash
# 1. 실패한 마이그레이션 해결
npx prisma migrate resolve --applied 20240109000000_add_real_name

# 2. 새로운 마이그레이션 배포
npx prisma migrate deploy

# 3. Prisma 클라이언트 재생성
npx prisma generate

# 4. 애플리케이션 빌드
npm run build
```

### 방법 3: SQL 직접 실행
```bash
# PostgreSQL에 직접 연결하여 SQL 실행
psql $DATABASE_URL -f prisma/deploy-veterinary-student.sql
```

## 📊 배포 검증

### 1. 데이터베이스 검증
```sql
-- UserType enum 확인
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserType');

-- 테이블 존재 확인
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'veterinary_student_profiles';

-- 인덱스 확인
SELECT indexname FROM pg_indexes 
WHERE tablename = 'veterinary_student_profiles';
```

### 2. 애플리케이션 테스트
1. **회원 유형 선택**: `/member-select` 페이지에서 수의학과 학생 옵션 확인
2. **회원가입**: `/register/veterinary-student`에서 가입 프로세스 테스트
3. **로그인**: `/login/veterinary-student`에서 로그인 테스트
4. **대학교 이메일 인증**: 유효한 대학교 도메인 검증 테스트

## 🔄 롤백 절차 (응급 시)

### 주의사항
⚠️ **롤백은 모든 수의학과 학생 데이터를 삭제합니다!** 
반드시 데이터 백업 후 실행하세요.

### 롤백 실행
```bash
# 데이터베이스 롤백
psql $DATABASE_URL -f prisma/rollback-veterinary-student.sql

# 코드 롤백 (Git)
git revert [commit-hash]

# 애플리케이션 재배포
npm run build
```

## 🎯 배포 후 모니터링

### 1. 로그 모니터링
```bash
# 회원가입 관련 로그 확인
tail -f logs/app.log | grep "veterinary-student\|registerVeterinaryStudent"

# 데이터베이스 연결 확인
tail -f logs/db.log | grep "veterinary_student_profiles"
```

### 2. 성능 모니터링
- 회원가입 응답 시간
- 데이터베이스 쿼리 성능
- S3 이미지 업로드 성능

### 3. 에러 모니터링
- 대학교 이메일 인증 실패율
- 회원가입 실패 사례
- API 에러 발생 현황

## 📈 배포 후 할 일

### 1. 즉시 (배포 후 1시간 내)
- [ ] 수의학과 학생 회원가입 테스트
- [ ] 로그 에러 확인
- [ ] 데이터베이스 연결 상태 확인

### 2. 단기 (배포 후 1일 내)
- [ ] 실제 사용자 회원가입 모니터링
- [ ] 대학교 도메인 검증 로직 검토
- [ ] 성능 지표 수집

### 3. 중장기 (배포 후 1주일 내)
- [ ] 사용자 피드백 수집
- [ ] 추가 대학교 도메인 등록
- [ ] 수의학과 학생 전용 기능 기획

## 🛠 문제 해결

### 자주 발생하는 문제

#### 1. 마이그레이션 실패
```
Error: Migration failed
```
**해결방법:**
```bash
# 실패한 마이그레이션 수동 해결
npx prisma migrate resolve --applied [migration-name]
```

#### 2. Enum 값 추가 실패
```
Error: enum value already exists
```
**해결방법**: 이미 enum 값이 존재하므로 무시하고 계속 진행

#### 3. 테이블 이미 존재
```
Error: relation already exists
```
**해결방법**: 배포 SQL에서 `IF NOT EXISTS` 조건 사용됨

## 📞 지원 및 문의
- **기술 지원**: 개발팀
- **데이터베이스 이슈**: DB 관리자
- **인프라 이슈**: DevOps 팀

---

**배포 일시**: 2025-09-11  
**배포자**: Claude AI Assistant  
**문서 버전**: 1.0