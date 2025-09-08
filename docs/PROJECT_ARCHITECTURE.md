### 핵심 원칙 1. **관심사의 분리**: 각 레이어가 명확한 책임을 가짐 2. **타입 안전성**: TypeScript를 통한 컴파일 타임 에러 방지 3. **상태 관리 이원화**: 서버 상태(React Query) + 클라이언트 상태(Zustand) 4. **자동화된 통합**: Hook Factory 패턴으로 보일러플레이트 최소화 5. **확장 가능성**: 새로운 기능 추가 시 일관된 패턴 적용 ### 하이브리드 아키텍처 다이어그램

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Components │ │ Hooks │ │ Store (Zustand) │
│ │◄──►│ (React Query) │◄──►│ │
│ UI Layer │ │ Server State │ │ Client State │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Service Layer │ │ Hook Factory │ │ Query Keys │
│ 📋 Shared Logic │ │ Pattern │ │ Management │
│ 🔄 Both SA & API│ │ │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│ │ │
┌────┴────┐ ▼ ▼
│ │ ┌─────────────────┐ ┌─────────────────┐
│ │ │ Utilities │ │ Database │
▼ ▼ │ S3, Helpers │ │ (Neon PostgreSQL)│
┌─────────┐ ┌─────────┐ └─────────────────┘ └─────────────────┘
│ Server │ │ API │ │ │
│ Actions │ │ Routes │ ▼ ▼
│ 📝 Forms│ │ 🌐 REST │ ┌─────────────────┐ ┌─────────────────┐
│ 🔄 CRUD │ │ 🔐 OAuth│ │ AWS S3 │ │ Database │
│ ⚡ Fast │ │ 📡 Hooks│ │ File Storage │ │ Operations │
└─────────┘ └─────────┘ └─────────────────┘ └─────────────────┘
│ │ │ │
▼ ▼ ▼ ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Form Actions │ │ External APIs │ │ File Storage │
│ Data Mutations │ │ Social Login │ │ Media Assets │
│ File Uploads │ │ Webhooks │ │ User Content │
└─────────────────┘ └─────────────────┘ └─────────────────┘

### 하이브리드 아키텍처 구성요소 | 레이어 | Server Actions | API Routes | Service Layer | |--------|---------------|------------|---------------| | **폼 처리** | ✅ 주력 | 🔄 보조 | 🔄 공통 로직 | | **외부 연동** | ❌ | ✅ 주력 | 🔄 공통 로직 | | **인증** | 🔄 로그인/가입 | ✅ OAuth | 🔄 공통 로직 | | **CRUD** | ✅ 간단한 작업 | 🔄 복잡한 API | 🔄 공통 로직 | ## 🛠️ 기술 스택 구성 ### Frontend Stack - **Next.js 15**: App Router, Server Components, Server Actions - **TypeScript**: 타입 안전성 - **Tailwind CSS**: 스타일링 - **React Query (TanStack Query)**: 서버 상태 관리 - **Zustand**: 클라이언트 상태 관리 ### Backend Stack (하이브리드) - **Next.js Server Actions**: 폼 처리, 내부 CRUD, 파일 업로드 - **Next.js API Routes**: OAuth, 웹훅, 외부 API, 복잡한 HTTP 처리 - **Neon PostgreSQL**: 메인 데이터베이스 - **AWS S3**: 파일 저장소 - **JWT**: 인증 토큰 ### 개발 도구 - **Prisma**: 데이터베이스 ORM (선택적) - **ESLint & Prettier**: 코드 품질 - **TypeScript Strict Mode**: 엄격한 타입 체크 ## 📁 하이브리드 프로젝트 구조

src/
├── 📁 actions/ # Server Actions (폼 처리, 내부 CRUD)
│ ├── auth.ts # 📝 폼 기반 인증 (로그인/회원가입)
│ ├── files.ts # 📁 파일 업로드 처리
│ ├── posts.ts # 📝 게시물 CRUD
│ └── comments.ts # 📝 댓글 처리
│
├── 📁 app/api/ # API Routes (외부 연동, 복잡한 HTTP)
│ ├── auth/  
│ │ ├── google/ # 🔐 OAuth 콜백
│ │ ├── kakao/ # 🔐 OAuth 콜백
│ │ └── naver/ # 🔐 OAuth 콜백
│ ├── webhooks/ # 📡 외부 서비스 웹훅
│ ├── docs/ # 📚 API 문서
│ └── upload/ # 📁 스트리밍 업로드
│
├── 📁 services/ # 🔄 Service Layer (공통 로직)
│ ├── auth.service.ts # 🔄 Server Actions + API Routes 공유
│ ├── post.service.ts # 🔄 비즈니스 로직 중앙화
│ └── file.service.ts # 🔄 파일 처리 공통 로직
│
├── 📁 hooks/ # React Query 훅들
│ ├── auth/
│ │ ├── useAuth.v2.ts # 🚀 Hook Factory (Server Actions용)
│ │ └── useOAuth.ts # 🌐 OAuth 처리 (API Routes용)
│ └── files/
│ └── useFiles.ts # 📁 파일 관리 훅
│
├── 📁 components/ # React 컴포넌트
│ ├── ui/ # 재사용 가능한 UI 컴포넌트
│ └── features/ # 기능별 컴포넌트
│ ├── auth/ # 인증 관련
│ │ ├── LoginForm.tsx # 📝 Server Actions 사용
│ │ └── SocialLogin.tsx # 🌐 API Routes 사용
│ └── profile/ # 프로필 관련
│
├── 📁 lib/ # 유틸리티 & 설정
│ ├── api-client.ts # API 응답 타입 & 헬퍼
│ ├── db.ts # 데이터베이스 연결
│ ├── hook-factory.ts # Hook Factory 패턴 구현
│ ├── react-query.ts # React Query 설정
│ ├── s3-config.ts # AWS S3 설정
│ └── s3-utils.ts # S3 유틸리티 함수
│
├── 📁 store/ # Zustand Stores
│ ├── authStore.ts # 인증 상태
│ ├── fileStore.ts # 파일 상태
│ └── uiStore.ts # UI 상태
│
└── 📁 types/ # TypeScript 타입 정의
├── auth.types.ts # 인증 관련 타입
├── api.types.ts # API 응답 타입
└── common.types.ts # 공통 타입
