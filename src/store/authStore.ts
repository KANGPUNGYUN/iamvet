import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  realName?: string; // 실명 추가
  type: 'veterinarian' | 'hospital';
  profileName?: string; // 수의사: 닉네임, 병원: 병원명
  profileImage?: string; // 프로필 이미지 URL
  phone?: string; // 연락처 추가
  birthDate?: string; // 생년월일 추가 (YYYY-MM-DD 형식)
}

interface AuthState {
  // 인증 상태 (서버 상태와 동기화)
  isAuthenticated: boolean;
  
  // UI 상태 (클라이언트 전용)
  isLoginModalOpen: boolean;
  isLoading: boolean;
  
  // 액션들
  setAuthenticated: (authenticated: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태
  isAuthenticated: false,
  isLoginModalOpen: false,
  isLoading: false,
  
  // 액션들
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({
    isAuthenticated: false,
    isLoginModalOpen: false,
    isLoading: false,
  }),
}));

export type { User };