/**
 * 인증 상태 관리를 위한 Zustand 스토어
 * 클라이언트 상태 (인증 여부, 사용자 타입 등) 관리
 */

import { create } from 'zustand';
import { removeTokenFromStorage } from '@/utils/auth';

interface AuthStore {
  isAuthenticated: boolean;
  userType: 'VETERINARIAN' | 'HOSPITAL' | 'VETERINARY_STUDENT' | null;
  userId: string | null;
  setAuth: (isAuth: boolean, userType?: string, userId?: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  userType: null,
  userId: null,
  
  setAuth: (isAuthenticated, userType, userId) => {
    set({ 
      isAuthenticated, 
      userType: userType as any, 
      userId: userId || null 
    });
  },
  
  logout: () => {
    removeTokenFromStorage();
    set({ 
      isAuthenticated: false, 
      userType: null, 
      userId: null 
    });
  },
  
  checkAuth: () => {
    // 초기 로드 시 토큰 검증
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isValid = payload.exp > Date.now() / 1000;
        
        if (isValid) {
          set({
            isAuthenticated: true,
            userType: payload.userType,
            userId: payload.userId
          });
        } else {
          get().logout();
        }
      } catch {
        get().logout();
      }
    }
  }
}));