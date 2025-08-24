# IAMVET 관리자 페이지

## 개요
IAMVET 프로젝트의 관리자 페이지입니다. CoreUI React를 기반으로 구현되었습니다.

## 구현된 기능

### 1. 대시보드 (`/admin`)
- 전체 시스템 현황 overview
- 최근 가입 회원 목록
- 처리 대기 신고 현황
- 시스템 상태 모니터링
- AI 매칭 성능 지표

### 2. 사용자 관리 (`/admin/users`)
- 전체 회원 목록 조회 (수의사/병원)
- 사용자 검색 및 필터링
- 계정 상태 관리 (활성/정지/대기)
- 권한 변경 (일반사용자/관리자/슈퍼관리자)
- 인증 상태 확인
- 사용자 정보 수정/삭제

### 3. 게시물 관리 (`/admin/posts`)
- **전체 게시물** 탭:
  - 채용공고, 교육콘텐츠, 양도양수, 커뮤니티 게시물 통합 관리
  - 게시물 상태 관리 (활성/검토중/정지/삭제)
  - 신고 횟수 모니터링
- **신고 관리** 탭:
  - 사용자 신고 접수 및 처리
  - 신고 상태 추적 (대기/조사중/해결됨/기각됨)
  - 신고 사유별 분류

### 4. AI 매칭 모니터링 (`/admin/ai-monitoring`)
- **매칭 로그** 탭:
  - 실시간 매칭 요청 및 결과 모니터링
  - 매칭 점수 및 실행 시간 추적
  - 성공/실패 결과 분석
- **모델 관리** 탭:
  - AI 모델 버전 관리
  - 모델 정확도 비교
  - 새 모델 업로드 및 배포
  - 모델 상태 관리 (활성/테스트/중단됨)

### 5. 통계/리포트 (`/admin/statistics`)
- 주요 지표 대시보드
- 시계열 데이터 차트 (일별/주별/월별/연별)
- 활발한 병원/수의사 순위
- 매칭 성공률 및 사용자 만족도
- 리포트 다운로드 기능

## 기술 스택
- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Library**: CoreUI React 5.7.1
- **Styling**: CoreUI CSS 5.4.2
- **Icons**: CoreUI Icons 3.0.1

## 설치 및 실행

```bash
# 패키지 설치 (이미 설치됨)
npm install @coreui/react @coreui/coreui @coreui/icons @coreui/icons-react @coreui/chartjs

# 개발 서버 실행
npm run dev

# 관리자 페이지 접속
http://localhost:3000/admin
```

## 폴더 구조
```
src/app/admin/
├── layout.tsx              # 관리자 레이아웃 (사이드바, 헤더)
├── page.tsx                # 대시보드 메인 페이지
├── globals.css             # CoreUI 스타일
├── users/
│   └── page.tsx           # 사용자 관리 페이지
├── posts/
│   └── page.tsx           # 게시물 관리 페이지
├── ai-monitoring/
│   └── page.tsx           # AI 모니터링 페이지
└── statistics/
    └── page.tsx           # 통계/리포트 페이지
```

## 주요 컴포넌트

### 레이아웃
- `CSidebar`: 네비게이션 사이드바
- `CHeader`: 상단 헤더 바
- `CBreadcrumb`: 브레드크럼 네비게이션

### 데이터 표시
- `CTable`: 반응형 테이블
- `CCard`: 콘텐츠 카드
- `CBadge`: 상태 뱃지
- `CProgress`: 진행률 바

### 인터랙션
- `CModal`: 모달 다이얼로그
- `CButton`: 액션 버튼
- `CFormInput/CFormSelect`: 폼 컨트롤

## 향후 개발 예정 기능

### Phase 2
1. **실시간 알림 시스템**
   - WebSocket 기반 실시간 신고 알림
   - 시스템 이상 상황 즉시 알림

2. **고급 분석 도구**
   - Chart.js 연동 시각화
   - 사용자 행동 분석
   - A/B 테스트 결과 분석

3. **자동화 시스템**
   - 스팸 게시물 자동 감지
   - 부적절한 이미지 자동 필터링
   - 정기 리포트 자동 생성

### Phase 3
1. **권한 관리 시스템**
   - 세분화된 권한 설정
   - 관리자 활동 로그

2. **시스템 설정**
   - 플랫폼 정책 설정
   - 이메일 템플릿 관리
   - 수수료 및 요금 설정

## API 연동 예정
현재는 더미 데이터로 구현되어 있으며, 다음 API들과 연동 예정입니다:

- `GET /admin/users` - 사용자 목록
- `PUT /admin/users/:id/role` - 권한 변경
- `GET /admin/posts` - 게시물 목록
- `PUT /admin/posts/:id/status` - 게시물 상태 변경
- `GET /admin/ai/logs` - AI 매칭 로그
- `POST /admin/ai/model` - 모델 업데이트
- `GET /admin/statistics` - 통계 데이터

## 보안 고려사항
- 관리자 인증 미들웨어 필요
- RBAC (Role-Based Access Control) 구현 필요
- 관리자 활동 감사 로그 필요
- 민감한 데이터 마스킹 처리 필요