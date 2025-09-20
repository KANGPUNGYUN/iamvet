# 토큰 디버거 사용법

브라우저에서 실제 토큰과 사용자 정보를 확인할 수 있는 디버그 컴포넌트입니다.

## 포함된 컴포넌트

### 1. TokenDebugger
- localStorage의 토큰 정보 확인
- JWT 토큰 내용 디코딩
- 토큰 만료 시간 확인
- 사용자 정보 표시
- 쿠키 정보 확인

### 2. DebugPanel (통합 패널)
- 여러 디버그 도구를 하나의 패널에서 관리
- 개발 환경에서만 표시

## 자동 설치 완료

디버그 컴포넌트는 이미 `ClientLayout.tsx`에 자동으로 추가되어 있습니다:

```tsx
{/* 개발 환경에서만 디버그 컴포넌트 표시 */}
{process.env.NODE_ENV === 'development' && <TokenDebugger />}
```

## 사용법

### 개발 서버 실행
```bash
npm run dev
```

개발 서버를 실행하면 브라우저 우측 하단에 "토큰 디버거" 버튼이 나타납니다.

### 기능

1. **토큰 상태 확인**
   - Access Token과 Refresh Token의 유효성 확인
   - 토큰 만료 시간 표시
   - 디코딩된 사용자 정보 표시

2. **localStorage 데이터**
   - 모든 인증 관련 localStorage 항목 표시
   - 개별 항목 삭제 가능
   - 전체 localStorage 초기화 가능

3. **토큰 복사**
   - 원본 토큰을 클립보드로 복사
   - 디코딩된 페이로드 확인

4. **실시간 새로고침**
   - "새로고침" 버튼으로 최신 상태 확인

### 수동 사용법

필요한 경우 다른 컴포넌트에서 직접 사용할 수 있습니다:

```tsx
import { TokenDebugger, DebugPanel } from '@/components/features/debug';

// 토큰 디버거만 사용
function MyComponent() {
  return (
    <div>
      {/* 다른 컴포넌트 내용 */}
      {process.env.NODE_ENV === 'development' && <TokenDebugger />}
    </div>
  );
}

// 통합 디버그 패널 사용
function MyApp() {
  return (
    <div>
      {/* 다른 컴포넌트 내용 */}
      <DebugPanel 
        enabledComponents={['token', 'auth']}
        position="bottom-left"
      />
    </div>
  );
}
```

## 보안 주의사항

- 이 컴포넌트는 **개발 환경에서만** 표시됩니다
- 프로덕션 빌드에서는 자동으로 제외됩니다
- 토큰 정보가 브라우저에 표시되므로 개발 시에만 사용하세요

## 파일 구조

```
src/
├── lib/
│   └── jwt-client.ts          # JWT 클라이언트 사이드 디코딩 유틸리티
└── components/
    └── features/
        └── debug/
            ├── index.ts       # 컴포넌트 export
            ├── TokenDebugger.tsx    # 메인 토큰 디버그 컴포넌트
            └── DebugPanel.tsx       # 통합 디버그 패널
```

## 주요 기능

### JWT 토큰 디코딩
- Base64URL 디코딩을 통한 JWT 페이로드 확인
- 토큰 만료 시간 계산
- 발급 시간 및 만료 시간 표시

### localStorage 관리
- 모든 인증 관련 데이터 표시
- 개별 항목 삭제
- 전체 초기화

### 사용자 정보 표시
- 사용자 타입 (veterinarian/hospital)
- 이메일 주소
- 프로필 정보

이제 개발 서버에서 브라우저를 열고 우측 하단의 "토큰 디버거" 버튼을 클릭하여 사용할 수 있습니다!