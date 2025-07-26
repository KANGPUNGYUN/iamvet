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
  userType: "veterinarian" | "hospital";
  email: string;
}

export const generateTokens = async (user: User) => {
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
