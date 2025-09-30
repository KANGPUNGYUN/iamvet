# Database Migration Guide

이 가이드는 배포환경에서 데이터베이스 마이그레이션을 실행하는 방법을 설명합니다.

## 개요

이 프로젝트는 `job_postings` 테이블에서 `jobs` 테이블로 마이그레이션되었습니다. 배포환경에서도 동일한 구조를 유지하기 위해 마이그레이션 스크립트가 제공됩니다.

## 마이그레이션 파일

- `migrations/000_create_migration_log.sql` - 마이그레이션 추적 테이블 생성
- `migrations/001_drop_job_postings_table.sql` - 기존 job_postings 테이블 삭제
- `migrations/002_ensure_jobs_table_structure.sql` - jobs 및 applications 테이블 구조 확인/생성

## 실행 방법

### 1. 개발환경에서 테스트

```bash
# 마이그레이션 상태 확인
npm run migrate:status

# 마이그레이션 실행
npm run migrate
```

### 2. 배포환경에서 실행

#### 옵션 A: npm 스크립트 사용
```bash
# 서버 시작 후
npm run migrate
```

#### 옵션 B: API 엔드포인트 직접 호출
```bash
# 마이그레이션 상태 확인
curl https://your-domain.com/api/migrate

# 마이그레이션 실행
curl -X POST https://your-domain.com/api/migrate
```

#### 옵션 C: 브라우저에서 실행
1. `https://your-domain.com/api/migrate`에 GET 요청으로 상태 확인
2. `https://your-domain.com/api/migrate`에 POST 요청으로 마이그레이션 실행

### 3. 수동 SQL 실행

마이그레이션 API가 작동하지 않는 경우, 데이터베이스에 직접 연결하여 실행:

```sql
-- 1. 마이그레이션 로그 테이블 생성
\i migrations/000_create_migration_log.sql

-- 2. job_postings 테이블 삭제
\i migrations/001_drop_job_postings_table.sql

-- 3. jobs 테이블 구조 확인
\i migrations/002_ensure_jobs_table_structure.sql
```

## 마이그레이션 확인

마이그레이션 완료 후 다음 사항을 확인하세요:

1. **테이블 존재 확인**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('jobs', 'applications', 'migration_log');
   ```

2. **마이그레이션 로그 확인**
   ```sql
   SELECT * FROM migration_log ORDER BY executed_at DESC;
   ```

3. **테이블 구조 확인**
   ```sql
   \d jobs
   \d applications
   ```

## 주의사항

- 마이그레이션은 안전하게 설계되어 기존 데이터를 보존합니다
- `job_postings` 테이블이 이미 없어도 오류가 발생하지 않습니다
- 각 마이그레이션은 중복 실행해도 안전합니다 (idempotent)
- 마이그레이션 로그를 통해 실행 이력을 추적할 수 있습니다

## 문제 해결

### 권한 오류
```
ERROR: permission denied for table jobs
```
→ 데이터베이스 사용자에게 적절한 권한이 있는지 확인

### 연결 오류
```
ECONNREFUSED
```
→ DATABASE_URL 환경변수와 데이터베이스 연결 상태 확인

### 테이블 이미 존재
```
ERROR: relation "jobs" already exists
```
→ 정상적인 상황입니다. `CREATE TABLE IF NOT EXISTS`를 사용하므로 무시됩니다.

## 롤백

마이그레이션을 롤백해야 하는 경우:

```sql
-- jobs 테이블 데이터를 job_postings로 복원 (필요시)
-- 주의: 데이터 손실 가능성이 있으므로 백업 필수
```

롤백은 신중하게 계획하고 백업을 먼저 수행하세요.