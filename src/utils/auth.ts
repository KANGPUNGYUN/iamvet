/**
 * 인증 관련 유틸리티 함수들
 * localStorage의 JWT 토큰 관리 및 사용자 정보 추출
 */

export const getTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // 원래 설계대로 쿠키 우선 확인 (서버에서 설정한 HttpOnly 쿠키)
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token' && value) {
      // 쿠키에서 찾으면 localStorage에도 동기화 (편의용)
      localStorage.setItem('accessToken', value);
      return value;
    }
  }
  
  // 쿠키에 없으면 localStorage에서 확인 (fallback)
  return localStorage.getItem('accessToken');
};

export const getUserIdFromToken = (token?: string | null): string | null => {
  try {
    const actualToken = token || getTokenFromStorage();
    console.log('[getUserIdFromToken] Token provided:', !!token);
    console.log('[getUserIdFromToken] Token from storage:', !!actualToken);
    
    if (!actualToken) {
      console.log('[getUserIdFromToken] No token available');
      return null;
    }
    
    const parts = actualToken.split('.');
    if (parts.length !== 3) {
      console.log('[getUserIdFromToken] Invalid token format');
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('[getUserIdFromToken] Token payload:', {
      userId: payload.userId,
      userType: payload.userType,
      exp: payload.exp,
      hasUserId: !!payload.userId
    });
    
    return payload.userId || null;
  } catch (error) {
    console.error('[getUserIdFromToken] Error parsing token:', error);
    return null;
  }
};

export const getUserTypeFromToken = (token?: string | null): string | null => {
  try {
    const actualToken = token || getTokenFromStorage();
    if (!actualToken) return null;
    
    const payload = JSON.parse(atob(actualToken.split('.')[1]));
    return payload.userType || null;
  } catch {
    return null;
  }
};

export const isTokenValid = (token?: string | null): boolean => {
  try {
    const actualToken = token || getTokenFromStorage();
    console.log('[isTokenValid] Checking token validity');
    
    if (!actualToken) {
      console.log('[isTokenValid] No token provided');
      return false;
    }
    
    const parts = actualToken.split('.');
    if (parts.length !== 3) {
      console.log('[isTokenValid] Invalid token format');
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;
    const isValid = payload.exp > now;
    
    console.log('[isTokenValid] Token expiry check:', {
      exp: payload.exp,
      now: now,
      isValid: isValid,
      timeLeft: payload.exp - now
    });
    
    return isValid;
  } catch (error) {
    console.error('[isTokenValid] Error validating token:', error);
    return false;
  }
};

export const removeTokenFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Remove any other auth-related keys that might exist
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.startsWith('auth') || 
    key.startsWith('user') || 
    key.startsWith('token') ||
    key.includes('Token')
  );
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

export const setTokenToStorage = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
};

export const getUserIdFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    const user = JSON.parse(userString);
    console.log('[getUserIdFromStorage] User from localStorage:', user);
    
    return user.id || null;
  } catch (error) {
    console.error('[getUserIdFromStorage] Error parsing user from localStorage:', error);
    return null;
  }
};