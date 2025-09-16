import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, login as loginAction, logout as logoutAction } from '@/actions/auth';
import { useAuthStore } from '@/store/authStore';
import { syncTokensWithCookie, removeAuthCookie } from '@/lib/auth';
import type { User } from '@/store/authStore';

interface LoginCredentials {
  email: string;
  password: string;
  userType?: "VETERINARIAN" | "HOSPITAL" | "VETERINARY_STUDENT";
}

// React Query 키 상수
export const authKeys = {
  currentUser: ['auth', 'currentUser'] as const,
};

// 현재 사용자 정보 조회 (서버 상태)
export function useCurrentUser() {
  // useState 대신 매번 localStorage를 직접 확인
  const getHasToken = () => {
    if (typeof window === 'undefined') return false;
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  };

  const getLocalUser = () => {
    if (typeof window === 'undefined') return null;
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: async (): Promise<(User & { phone?: string }) | null> => {
      const hasToken = getHasToken();
      const localUser = getLocalUser();
      
      console.log('[useCurrentUser] queryFn called, hasToken:', hasToken, 'localUser:', !!localUser);
      
      // localStorage에 사용자 정보가 있고 토큰도 있으면 localStorage 정보를 우선 사용
      if (hasToken && localUser) {
        console.log('[useCurrentUser] Using localStorage user data:', localUser);
        const userData = {
          id: localUser.id,
          name: localUser.name,
          email: localUser.email,
          realName: localUser.realName,
          type: localUser.userType === "veterinary-student" ? "veterinarian" : localUser.userType,
          profileName: localUser.profileName || localUser.name,
          profileImage: localUser.profileImage,
          phone: localUser.phone,
        };
        console.log('[useCurrentUser] returning localStorage user data:', userData);
        return userData;
      }
      
      // localStorage에 정보가 없으면 서버에서 가져오기 시도
      const result = await getCurrentUser();
      console.log('[useCurrentUser] getCurrentUser result:', result);
      
      if (result.success && result.user) {
        const userData = {
          id: result.user.id,
          name: result.user.username,
          email: result.user.email,
          realName: result.user.realName, // 실명 추가
          type: result.user.userType === "VETERINARIAN" ? "veterinarian" : "hospital",
          profileName: result.user.profileName,
          profileImage: result.user.profileImage, // 프로필 이미지 추가
          phone: result.user.phone, // Add phone field
        };
        console.log('[useCurrentUser] returning server user data:', userData);
        return userData;
      }
      console.log('[useCurrentUser] returning null');
      return null;
    },
    enabled: getHasToken(), // 매번 localStorage를 확인
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    retry: false, // 인증 실패 시 재시도하지 않음
  });
}

// 로그인 뮤테이션
export function useLogin() {
  const queryClient = useQueryClient();
  const { setAuthenticated, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      const result = await loginAction(credentials);
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        // Zustand 상태 업데이트
        setAuthenticated(true);
        
        // React Query 캐시 무효화하여 사용자 정보 다시 가져오기
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
}

// 로그아웃 뮤테이션
export function useLogout() {
  const queryClient = useQueryClient();
  const { reset } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const result = await logoutAction();
      return result;
    },
    onSuccess: () => {
      // Zustand 상태 초기화
      reset();
      
      // localStorage와 쿠키에서 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      removeAuthCookie();
      
      // React Query 캐시 클리어
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    },
  });
}

// 인증 상태 훅 (Zustand + React Query 결합)
export function useAuth() {
  const { data: user, isLoading: isUserLoading, error, refetch } = useCurrentUser();
  const { isAuthenticated, isLoading: isAuthLoading, setAuthenticated } = useAuthStore();
  
  console.log('[useAuth] Current state:', {
    user: !!user,
    isUserLoading,
    error: !!error,
    isAuthenticated,
    isAuthLoading
  });
  
  // localStorage 토큰을 쿠키로 동기화
  React.useEffect(() => {
    syncTokensWithCookie();
    
    // 추가적으로 localStorage 토큰을 직접 쿠키로 설정
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      console.log('[useAuth] Setting cookie from localStorage token');
      const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `auth-token=${accessToken}; expires=${expireDate.toUTCString()}; path=/; secure; samesite=strict`;
    }
  }, []);

  // localStorage 변화 감지하여 사용자 정보 다시 가져오기
  React.useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem('accessToken');
      console.log('[useAuth] handleStorageChange - accessToken:', !!accessToken, 'user:', !!user);
      if (accessToken && !user) {
        console.log('[useAuth] Refetching user data...');
        // 토큰이 있지만 사용자 정보가 없으면 다시 가져오기
        refetch();
      }
    };

    // 페이지 포커스 시에도 확인 (다른 탭에서 로그인했을 경우)
    window.addEventListener('focus', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트 마운트 시 즉시 확인
    handleStorageChange();

    return () => {
      window.removeEventListener('focus', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, refetch]);
  
  // 서버 상태와 클라이언트 상태 동기화
  const actuallyAuthenticated = !!user && !error;
  
  console.log('[useAuth] Authentication status:', {
    actuallyAuthenticated,
    isAuthenticated,
    userExists: !!user,
    hasError: !!error
  });
  
  // useEffect로 상태 동기화 (렌더링 중 setState 방지)
  React.useEffect(() => {
    if (actuallyAuthenticated !== isAuthenticated) {
      console.log('[useAuth] Updating authentication state:', actuallyAuthenticated);
      setAuthenticated(actuallyAuthenticated);
    }
  }, [actuallyAuthenticated, isAuthenticated, setAuthenticated]);

  return {
    user,
    isAuthenticated: actuallyAuthenticated,
    isLoading: isUserLoading || isAuthLoading,
    error,
  };
}