"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { sql } from "@/lib/db";

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Simple ID generator (similar to cuid2)
function createId() {
  return randomBytes(12).toString("base64url");
}

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  userType: "VETERINARIAN" | "HOSPITAL";
  profileImage?: string;
  provider: "NORMAL" | "GOOGLE" | "KAKAO" | "NAVER";
  isActive: boolean;
  termsAgreedAt?: Date;
  privacyAgreedAt?: Date;
  marketingAgreedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType?: "VETERINARIAN" | "HOSPITAL";
}

export interface RegisterData {
  username: string;
  email: string;
  phone: string;
  password: string;
  userType: "VETERINARIAN" | "HOSPITAL";
  profileImage?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

export interface VeterinarianProfileData {
  nickname: string;
  birthDate?: Date;
  licenseImage: string;
  experience?: string;
  specialty?: string;
  introduction?: string;
}

export interface HospitalProfileData {
  hospitalName: string;
  businessNumber: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  businessLicense: string;
}

// Auth actions
export async function login(credentials: LoginCredentials) {
  const { email, password, userType } = credentials;
  try {

    // Get user by email and userType (if specified)
    const result = userType 
      ? await sql`SELECT * FROM users WHERE email = ${email} AND "userType" = ${userType} AND "isActive" = true`
      : await sql`SELECT * FROM users WHERE email = ${email} AND "isActive" = true`;

    if (result.length === 0) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }

    const user = result[0];

    // Verify password
    if (!user.passwordHash) {
      return { success: false, error: "소셜 로그인 계정입니다. 소셜 로그인을 이용해주세요." };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "비밀번호가 올바르지 않습니다." };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.userType 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        profileImage: user.profileImage,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      email,
      userType
    });
    return { success: false, error: `로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function register(data: RegisterData, profileData?: VeterinarianProfileData | HospitalProfileData) {
  try {
    const {
      username,
      email,
      phone,
      password,
      userType,
      profileImage,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    } = data;

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} OR phone = ${phone}
    `;

    if (existingUser.length > 0) {
      return { success: false, error: "이미 가입된 이메일 또는 전화번호입니다." };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userResult = await sql`
      INSERT INTO users (
        username, email, phone, password_hash, user_type, profile_image,
        terms_agreed_at, privacy_agreed_at, marketing_agreed_at
      )
      VALUES (
        ${username}, ${email}, ${phone}, ${passwordHash}, ${userType}, ${profileImage},
        ${termsAgreed ? new Date() : null}, ${privacyAgreed ? new Date() : null}, ${marketingAgreed ? new Date() : null}
      )
      RETURNING *
    `;

    const user = userResult[0];

    // Create profile based on user type
    if (userType === "VETERINARIAN" && profileData) {
      const vetData = profileData as VeterinarianProfileData;
      await sql`
        INSERT INTO veterinarian_profiles (
          user_id, nickname, birth_date, license_image, experience, specialty, introduction
        )
        VALUES (
          ${user.id}, ${vetData.nickname}, ${vetData.birthDate}, ${vetData.licenseImage}, 
          ${vetData.experience}, ${vetData.specialty}, ${vetData.introduction}
        )
      `;
    } else if (userType === "HOSPITAL" && profileData) {
      const hospitalData = profileData as HospitalProfileData;
      await sql`
        INSERT INTO hospital_profiles (
          user_id, hospital_name, business_number, address, phone, website, description, business_license
        )
        VALUES (
          ${user.id}, ${hospitalData.hospitalName}, ${hospitalData.businessNumber}, 
          ${hospitalData.address}, ${hospitalData.phone}, ${hospitalData.website}, 
          ${hospitalData.description}, ${hospitalData.businessLicense}
        )
      `;
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.user_type,
      },
    };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "회원가입 중 오류가 발생했습니다." };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "로그아웃 중 오류가 발생했습니다." };
  }
}

export async function getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return { success: false, error: "인증 토큰이 없습니다." };
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get current user data
    const result = await sql`
      SELECT * FROM users WHERE id = ${decoded.userId} AND "isActive" = true
    `;

    if (result.length === 0) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }

    const user = result[0];

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        profileImage: user.profileImage,
        provider: user.provider,
        isActive: user.isActive,
        termsAgreedAt: user.termsAgreedAt,
        privacyAgreedAt: user.privacyAgreedAt,
        marketingAgreedAt: user.marketingAgreedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return { success: false, error: "사용자 정보를 가져오는 중 오류가 발생했습니다." };
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    const userId = userResult.user.id;

    // Get current password hash
    const result = await sql`
      SELECT "passwordHash" FROM users WHERE id = ${userId}
    `;

    if (result.length === 0) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }

    const user = result[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "현재 비밀번호가 올바르지 않습니다." };
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await sql`
      UPDATE users SET "passwordHash" = ${newPasswordHash}, "updatedAt" = NOW() WHERE id = ${userId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error);
    return { success: false, error: "비밀번호 변경 중 오류가 발생했습니다." };
  }
}

export async function deleteAccount(password: string) {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    const userId = userResult.user.id;

    // Get current password hash
    const result = await sql`
      SELECT "passwordHash" FROM users WHERE id = ${userId}
    `;

    if (result.length === 0) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }

    const user = result[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "비밀번호가 올바르지 않습니다." };
    }

    // Soft delete user
    await sql`
      UPDATE users SET "isActive" = false, "deletedAt" = NOW() WHERE id = ${userId}
    `;

    // Clear auth cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return { success: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return { success: false, error: "계정 삭제 중 오류가 발생했습니다." };
  }
}

export async function getUserByEmail(email: string, userType?: "VETERINARIAN" | "HOSPITAL") {
  try {
    const result = userType
      ? await sql`SELECT * FROM users WHERE email = ${email} AND "userType" = ${userType} AND "isActive" = true`
      : await sql`SELECT * FROM users WHERE email = ${email} AND "isActive" = true`;

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      userType: user.userType,
      profileImage: user.profileImage,
      provider: user.provider,
    };
  } catch (error) {
    console.error("Get user by email error:", error);
    return null;
  }
}

export async function createSocialUser(userData: {
  email: string;
  username: string;
  profileImage?: string;
  provider: "GOOGLE" | "KAKAO" | "NAVER";
  providerId: string;
  userType: "VETERINARIAN" | "HOSPITAL";
}) {
  try {
    // Create user
    const userResult = await sql`
      INSERT INTO users (
        id, username, email, "userType", "profileImage", provider,
        "termsAgreedAt", "privacyAgreedAt", "createdAt", "updatedAt"
      )
      VALUES (
        ${createId()}, ${userData.username}, ${userData.email}, ${userData.userType}, 
        ${userData.profileImage}, ${userData.provider}, NOW(), NOW(), NOW(), NOW()
      )
      RETURNING *
    `;

    const user = userResult[0];

    // Create social account
    await sql`
      INSERT INTO social_accounts (
        id, "userId", provider, "providerId", "createdAt", "updatedAt"
      )
      VALUES (${createId()}, ${user.id}, ${userData.provider}, ${userData.providerId}, NOW(), NOW())
    `;

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        profileImage: user.profileImage,
      },
    };
  } catch (error) {
    console.error("Create social user error:", error);
    return { success: false, error: "소셜 계정 생성 중 오류가 발생했습니다." };
  }
}