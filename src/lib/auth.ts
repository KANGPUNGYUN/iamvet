// src/lib/auth.ts - JWT 인증 관련 유틸리티
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || JWT_SECRET + "_admin";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export interface JwtPayload {
  userId: string;
  userType: "veterinarian" | "hospital" | "VETERINARIAN" | "HOSPITAL" | "VETERINARY_STUDENT";
  email: string;
}

export const generateTokens = async (user: any) => {
  // userType을 대문자로 유지 (데이터베이스와 일치)
  const payload: JwtPayload = {
    userId: user.id,
    userType: user.userType,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET as string, { expiresIn: "1h" } as SignOptions);
  const refreshToken = jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN as string,
  } as SignOptions);

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600, // 1시간
  };
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('[verifyToken] Token expired:', error.expiredAt);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('[verifyToken] Invalid token:', error.message);
    } else {
      console.log('[verifyToken] Token verification error:', error);
    }
    return null;
  }
};

export const verifyAdminTokenJWT = (token: string): any | null => {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET as string);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// 클라이언트 사이드 토큰 관리
export const setAuthCookie = (token: string, expires?: Date) => {
  if (typeof window === 'undefined') return;
  
  const expireDate = expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; secure' : '';
  
  document.cookie = `auth-token=${token}; expires=${expireDate.toUTCString()}; path=/${secureFlag}; samesite=strict`;
};

export const removeAuthCookie = () => {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const getAuthTokenFromStorage = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('accessToken');
};

export const syncTokensWithCookie = () => {
  if (typeof window === 'undefined') return;
  
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    // 토큰 유효성 검사
    const payload = verifyToken(accessToken);
    if (payload) {
      setAuthCookie(accessToken);
    } else {
      // 유효하지 않은 토큰이면 localStorage에서 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      removeAuthCookie();
    }
  }
};

// 관리자 토큰 검증 함수
export const verifyAdminToken = (request: any) => {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const authHeader = request.headers.get("authorization");
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      // 쿠키에서 토큰 가져오기
      const adminTokenCookie = request.cookies?.get?.("admin-token")?.value;
      const userTokenCookie = request.cookies?.get?.("token")?.value;
      
      if (adminTokenCookie) {
        token = adminTokenCookie;
      } else if (userTokenCookie) {
        // 일반 사용자 토큰도 확인
        token = userTokenCookie;
      }
    }

    if (!token) {
      return { success: false, error: "인증 토큰이 없습니다" };
    }

    // 먼저 관리자 토큰으로 검증 시도
    let payload = verifyAdminTokenJWT(token);
    let isAdminToken = true;
    
    if (!payload) {
      // 관리자 토큰이 아니면 일반 사용자 토큰으로 검증 시도
      payload = verifyToken(token);
      isAdminToken = false;
    }
    
    if (!payload) {
      return { success: false, error: "유효하지 않은 토큰입니다" };
    }

    // 일반 사용자 토큰인 경우 관리자 권한 확인 필요
    // TODO: 데이터베이스에서 사용자의 관리자 권한 확인
    if (!isAdminToken) {
      // 임시로 특정 이메일만 관리자 권한 부여
      const adminEmails = ["admin@example.com", "kpy2709@gmail.com"];
      if (!adminEmails.includes(payload.email)) {
        return { success: false, error: "관리자 권한이 없습니다" };
      }
    }

    return { success: true, payload, isAdminToken };

  } catch (error) {
    return { success: false, error: "토큰 검증 중 오류가 발생했습니다" };
  }
};
