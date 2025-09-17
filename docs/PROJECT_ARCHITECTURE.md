# iamvet Project Architecture

## 개요
iamvet 프로젝트는 간단하고 안전한 아키텺처를 지향합니다. 불필요한 중간 레이어를 제거하고 직접적인 데이터 흐름을 통해 성능과 유지보수성을 개선합니다.

## 핵심 원칙

### 1. 단순성 우선 (Simplicity First)
- 복잡한 API 중간 레이어 제거
- 직접적인 데이터베이스 쿼리 활용
- 최소한의 추상화

### 2. 상태 관리 중앙화
- **React Query**: 서버 상태 관리 및 캐싱
- **Zustand**: 클라이언트 상태 관리
- **localStorage**: 인증 토큰 및 사용자 설정

### 3. 타입 안전성
- TypeScript 엄격 모드
- 데이터베이스 스키마와 일치하는 타입 정의
- API 응답 타입 검증

## 새로운 간단한 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   State Mgmt    │    │   Database      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ React Pages │ │◄──►│ │ React Query │ │◄──►│ │ PostgreSQL  │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Components  │ │◄──►│ │   Zustand   │ │    │ │   Prisma    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │                 │
│ │ Custom Hooks│ │◄──►│ │localStorage │ │    │                 │
│ └─────────────┘ │    │ └─────────────┘ │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 데이터 흐름

### 1. 인증 흐름
```
1. 사용자 로그인 → JWT 토큰 발급
2. JWT 토큰을 localStorage에 저장
3. 모든 요청에서 JWT에서 userId 추출
4. 필요시 토큰 갱신
```

### 2. 데이터 조회 흐름
```
1. Component에서 React Query hook 호출
2. hook에서 localStorage에서 JWT 토큰 확인
3. JWT에서 userId 추출
4. 직접 데이터베이스 쿼리 실행
5. React Query가 결과 캐싱 및 상태 관리
```

### 3. 데이터 업데이트 흐름
```
1. Component에서 React Query mutation 호출
2. 데이터베이스 직접 업데이트
3. React Query가 관련 캐시 무효화
4. Zustand로 즉시 UI 상태 업데이트
```

## 구현 가이드

### 1. 인증 관리

#### JWT 토큰 유틸리티
```typescript
// utils/auth.ts
export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};
```

### 2. 상태 관리

#### React Query 설정
```typescript
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
```

#### Zustand 스토어
```typescript
// stores/authStore.ts
import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  userType: 'VETERINARIAN' | 'HOSPITAL' | 'VETERINARY_STUDENT' | null;
  setAuth: (isAuth: boolean, userType?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  userType: null,
  setAuth: (isAuthenticated, userType) => 
    set({ isAuthenticated, userType: userType as any }),
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isAuthenticated: false, userType: null });
  },
}));
```

### 3. 데이터 조회 패턴

#### 사용자 프로필 조회
```typescript
// hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { sql } from '@/lib/database';
import { getTokenFromStorage, getUserIdFromToken } from '@/utils/auth';

export const useVeterinarianProfile = () => {
  return useQuery({
    queryKey: ['veterinarian-profile'],
    queryFn: async () => {
      const token = getTokenFromStorage();
      if (!token) throw new Error('No access token');
      
      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error('Invalid token');

      const result = await sql`
        SELECT 
          u.id, u.email, u.phone, u."profileImage", u."loginId", 
          u.nickname, u."realName", u."birthDate", u."licenseImage",
          u."userType", u.provider, u."isActive", u."updatedAt", u."createdAt",
          vp.experience, vp.specialty
        FROM users u
        LEFT JOIN veterinarian_profiles vp ON u.id = vp."userId"
        WHERE u.id = ${userId} AND u."isActive" = true
      `;

      return result[0];
    },
    enabled: !!getTokenFromStorage(),
  });
};
```

#### 프로필 업데이트
```typescript
// hooks/useProfileMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sql } from '@/lib/database';

export const useUpdateVeterinarianProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const token = getTokenFromStorage();
      const userId = getUserIdFromToken(token!);

      // users 테이블 업데이트
      await sql`
        UPDATE users 
        SET 
          nickname = ${data.nickname},
          phone = ${data.phone},
          email = ${data.email},
          "realName" = ${data.realName},
          "birthDate" = ${data.birthDate},
          "licenseImage" = ${data.licenseImage},
          "updatedAt" = NOW()
        WHERE id = ${userId}
      `;

      // veterinarian_profiles 테이블 업데이트 (필요시)
      if (data.experience || data.specialty) {
        await sql`
          INSERT INTO veterinarian_profiles 
          (id, "userId", nickname, "birthDate", "licenseImage", experience, specialty, "createdAt", "updatedAt")
          VALUES (${`vet_${userId}`}, ${userId}, ${data.nickname}, ${data.birthDate}, ${data.licenseImage}, ${data.experience}, ${data.specialty}, NOW(), NOW())
          ON CONFLICT ("userId") DO UPDATE SET
            nickname = EXCLUDED.nickname,
            "birthDate" = EXCLUDED."birthDate",
            "licenseImage" = EXCLUDED."licenseImage",
            experience = EXCLUDED.experience,
            specialty = EXCLUDED.specialty,
            "updatedAt" = NOW()
        `;
      }

      return { success: true };
    },
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries(['veterinarian-profile']);
    },
  });
};
```

### 4. 컴포넌트 구현 패턴

```typescript
// pages/profile/page.tsx
import { useVeterinarianProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useVeterinarianProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h1>{profile.realName}</h1>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      {profile.licenseImage && (
        <img src={profile.licenseImage} alt="License" />
      )}
    </div>
  );
}
```

## 간소화된 파일 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── hooks/              # React Query hooks 및 커스텀 훅
│   ├── useProfile.ts
│   ├── useAuth.ts
│   └── useMutations.ts
├── stores/             # Zustand 스토어
│   ├── authStore.ts
│   └── uiStore.ts
├── utils/              # 유틸리티 함수
│   ├── auth.ts
│   ├── validation.ts
│   └── constants.ts
├── lib/                # 라이브러리 설정
│   ├── database.ts
│   ├── react-query.ts
│   └── types.ts
└── app/                # Next.js 페이지
```

## 마이그레이션 가이드

### 기존 API 라우트 → 직접 DB 쿼리

#### Before (복잡한 API 라우트)
```typescript
// /api/profile/route.ts
export async function GET(request: NextRequest) {
  const user = getUser(request);
  const profile = await getVeterinarianProfile(user.userId);
  return NextResponse.json(profile);
}

// pages/profile.tsx
const response = await fetch('/api/profile');
const profile = await response.json();
```

#### After (직접 DB 쿼리)
```typescript
// hooks/useProfile.ts
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const userId = getUserIdFromToken();
      return await sql`SELECT * FROM users WHERE id = ${userId}`;
    },
  });
};

// pages/profile.tsx
const { data: profile } = useProfile();
```

## 성능 최적화

### 1. React Query 최적화
- **적절한 staleTime 설정**: 자주 변경되지 않는 데이터는 긴 staleTime
- **선택적 쿼리 실행**: enabled 옵션으로 조건부 실행
- **쿼리 무효화 최적화**: 정확한 범위의 캐시만 무효화

### 2. 데이터베이스 최적화
- **인덱스 활용**: 자주 조회되는 컬럼에 인덱스 설정
- **조인 최적화**: 필요한 데이터만 조인
- **배치 처리**: 여러 작업을 하나의 트랜잭션으로 처리

### 3. 번들 최적화
- **코드 스플리팅**: 페이지별 동적 import
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **라이브러리 최적화**: 필요한 부분만 import

## 보안 고려사항

### 1. JWT 토큰 관리
- **토큰 만료 처리**: 자동 갱신 또는 로그아웃
- **안전한 저장**: httpOnly 쿠키 고려 (필요시)
- **토큰 검증**: 클라이언트에서 기본 검증

### 2. 데이터베이스 보안
- **SQL 인젝션 방지**: 매개변수화된 쿼리 사용
- **권한 검증**: 사용자별 데이터 접근 제한
- **민감 정보 보호**: 비밀번호 등 민감 데이터 암호화

### 3. 클라이언트 보안
- **XSS 방지**: 사용자 입력 검증 및 이스케이프
- **CSRF 방지**: 토큰 기반 요청 검증
- **HTTPS 강제**: 모든 통신 암호화

## 실제 적용 예시

### 1. 프로필 조회 페이지 리팩토링

```typescript
// Before: 복잡한 API 의존성
const [profileData, setProfileData] = useState(null);
useEffect(() => {
  fetch('/api/profile').then(res => res.json()).then(setProfileData);
}, []);

// After: 직접 DB 쿼리 + React Query
const { data: profile, isLoading } = useVeterinarianProfile();
```

### 2. 프로필 업데이트 리팩토링

```typescript
// Before: 복잡한 FormData + API
const handleSubmit = async (formData) => {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(formData)
  });
};

// After: React Query Mutation
const updateProfile = useUpdateVeterinarianProfile();
const handleSubmit = (formData) => {
  updateProfile.mutate(formData);
};
```

이 아키텍처를 통해 더 간단하고 유지보수하기 쉬운 코드베이스를 구축할 수 있습니다.