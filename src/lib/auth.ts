// src/lib/auth.ts - JWT 인증 관련 유틸리티
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
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
  document.cookie = `auth-token=${token}; expires=${expireDate.toUTCString()}; path=/; secure; samesite=strict`;
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
    setAuthCookie(accessToken);
  }
};
