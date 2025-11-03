/**
 * 전역 API 클라이언트
 * 쿠키 기반 인증을 우선으로 하되, 모바일 환경에서는 Authorization 헤더도 지원
 */

import axios from 'axios';
import { getTokenFromStorage } from '@/utils/auth';

// 모바일 환경 감지
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// 전역 axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 자동 포함
  timeout: 30000,
});

// 요청 인터셉터: 모바일에서는 Authorization 헤더도 추가
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API Client] Request:', config.method?.toUpperCase(), config.url);
    
    // 모바일 환경에서는 Authorization 헤더도 함께 전송
    if (isMobile()) {
      const token = getTokenFromStorage();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[API Client] Mobile: Added Authorization header');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('[API Client] Request error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[API Client] Response error:', error.response?.status, error.response?.data);
    
    // 401 에러시 토큰 정리 (쿠키는 서버에서 처리)
    if (error.response?.status === 401) {
      console.log('[API Client] 401 error - clearing localStorage');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

// 편의 함수들
export const api = {
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),
  patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
};

export default apiClient;