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
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('accessToken')) : null;
    
    if (token) {
      console.log('Token found, length:', token.length, 'first 20 chars:', token.substring(0, 20)); // 디버깅용
      
      try {
        // JWT 형식 확인
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.log('Non-JWT token detected, checking user data instead');
          // token이 JWT가 아닌 경우 user 정보에서 확인
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              if (user && user.id) {
                console.log('Valid user data found, setting authenticated state');
                set({
                  isAuthenticated: true,
                  userType: user.userType || user.type,
                  userId: user.id
                });
                return;
              }
            } catch (e) {
              console.error('Failed to parse user data:', e);
            }
          }
          console.log('No valid user data found, logging out');
          get().logout();
          return;
        }
        
        // Base64 디코딩을 안전하게 수행
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        const isValid = payload.exp > Date.now() / 1000;
        
        console.log('checkAuth payload:', payload); // 디버깅용
        
        if (isValid) {
          set({
            isAuthenticated: true,
            userType: payload.userType,
            userId: payload.userId
          });
        } else {
          get().logout();
        }
      } catch (error) {
        console.error('checkAuth error:', error); // 디버깅용
        get().logout();
      }
    }
  }
}));