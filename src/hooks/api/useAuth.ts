import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, login as loginAction, logout as logoutAction } from '@/actions/auth';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/store/authStore';

interface LoginCredentials {
  email: string;
  password: string;
  userType?: "VETERINARIAN" | "HOSPITAL";
}

// React Query 키 상수
export const authKeys = {
  currentUser: ['auth', 'currentUser'] as const,
};

// 현재 사용자 정보 조회 (서버 상태)
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: async (): Promise<User | null> => {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        return {
          id: result.user.id,
          name: result.user.username,
          email: result.user.email,
          type: result.user.userType === "VETERINARIAN" ? "veterinarian" : "hospital",
        };
      }
      return null;
    },
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
      
      // React Query 캐시 클리어
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    },
  });
}

// 인증 상태 훅 (Zustand + React Query 결합)
export function useAuth() {
  const { data: user, isLoading: isUserLoading, error } = useCurrentUser();
  const { isAuthenticated, isLoading: isAuthLoading, setAuthenticated } = useAuthStore();
  
  // 서버 상태와 클라이언트 상태 동기화
  const actuallyAuthenticated = !!user && !error;
  
  // useEffect로 상태 동기화 (렌더링 중 setState 방지)
  React.useEffect(() => {
    if (actuallyAuthenticated !== isAuthenticated) {
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