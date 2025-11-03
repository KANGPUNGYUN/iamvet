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
        // JWT 형식 확인
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.log('Invalid token format, clearing auth state');
          get().logout();
          return;
        }
        
        // JWT 페이로드 파싱
        const payload = JSON.parse(atob(parts[1]));
        const isValid = payload.exp > Date.now() / 1000;
        
        console.log('checkAuth payload:', {
          userId: payload.userId,
          userType: payload.userType,
          exp: payload.exp,
          isValid
        });
        
        if (isValid && payload.userId) {
          set({
            isAuthenticated: true,
            userType: payload.userType,
            userId: payload.userId
          });
        } else {
          console.log('Token expired or invalid, clearing auth state');
          get().logout();
        }
      } catch (error) {
        console.error('checkAuth error:', error);
        get().logout();
      }
    }
  }
}));