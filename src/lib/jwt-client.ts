// src/lib/jwt-client.ts - 클라이언트 사이드 JWT 디코딩 유틸리티

export interface DecodedToken {
  userId: string;
  userType: "veterinarian" | "hospital";
  email: string;
  iat?: number;
  exp?: number;
}

// Base64URL 디코딩
function base64UrlDecode(str: string): string {
  // Base64URL을 Base64로 변환
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // 패딩 추가
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  
  return atob(base64);
}

// JWT 토큰 디코딩 (검증 없이 - 클라이언트 사이드용)
export function decodeJWT(token: string): DecodedToken | null {
  try {
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // payload 부분 디코딩
    const payload = parts[1];
    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded) as DecodedToken;
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
}

// 토큰 만료 확인
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    // exp는 초 단위, Date.now()는 밀리초 단위
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

// 토큰 만료까지 남은 시간 (분 단위)
export function getTokenExpirationTime(token: string): number | null {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const remainingTime = Math.max(0, expirationTime - currentTime);
    
    return Math.floor(remainingTime / (1000 * 60)); // 분 단위로 반환
  } catch (error) {
    return null;
  }
}

// 토큰 발급 시간
export function getTokenIssuedTime(token: string): Date | null {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.iat) {
      return null;
    }

    return new Date(decoded.iat * 1000);
  } catch (error) {
    return null;
  }
}

// 토큰 만료 시간
export function getTokenExpirationDate(token: string): Date | null {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
}