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
  licenseImage?: string;
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
      return {
        success: false,
        error: "소셜 로그인 계정입니다. 소셜 로그인을 이용해주세요.",
      };
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
        userType: user.userType,
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
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      email,
      userType,
    });
    return {
      success: false,
      error: `로그인 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function register(
  data: RegisterData,
  profileData?: VeterinarianProfileData | HospitalProfileData
) {
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
      return {
        success: false,
        error: "이미 가입된 이메일 또는 전화번호입니다.",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userResult = await sql`
      INSERT INTO users (
        username, email, phone, "passwordHash", "userType", "profileImage",
        "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt"
      )
      VALUES (
        ${username}, ${email}, ${phone}, ${passwordHash}, ${userType}, ${profileImage},
        ${termsAgreed ? new Date() : null}, ${
      privacyAgreed ? new Date() : null
    }, ${marketingAgreed ? new Date() : null}
      )
      RETURNING *
    `;

    const user = userResult[0];

    // Create profile based on user type
    if (userType === "VETERINARIAN" && profileData) {
      const vetData = profileData as VeterinarianProfileData;
      await sql`
        INSERT INTO veterinarian_profiles (
          "userId", nickname, "birthDate", "licenseImage", experience, specialty, introduction
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
          "userId", "hospitalName", "businessNumber", address, phone, website, description, "businessLicense"
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
        userType: user.userType,
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

export async function getCurrentUser(): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
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
    return {
      success: false,
      error: "사용자 정보를 가져오는 중 오류가 발생했습니다.",
    };
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
) {
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
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
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

export async function getUserByEmail(
  email: string,
  userType?: "VETERINARIAN" | "HOSPITAL"
) {
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
        ${createId()}, ${userData.username}, ${userData.email}, ${
      userData.userType
    }, 
        ${userData.profileImage}, ${
      userData.provider
    }, NOW(), NOW(), NOW(), NOW()
      )
      RETURNING *
    `;

    const user = userResult[0];

    // Create social account
    await sql`
      INSERT INTO social_accounts (
        id, "userId", provider, "providerId", "createdAt", "updatedAt"
      )
      VALUES (${createId()}, ${user.id}, ${userData.provider}, ${
      userData.providerId
    }, NOW(), NOW())
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

export async function checkUserIdDuplicate(username: string) {
  try {
    console.log("Checking username duplicate for:", username);

    // 먼저 모든 사용자 확인
    const allUsers = await sql`SELECT username FROM users LIMIT 10`;
    console.log(
      "All usernames in DB:",
      allUsers.map((u) => u.username)
    );

    // 특정 username 검색
    const result = await sql`
      SELECT id, username, "isActive" FROM users WHERE username = ${username}
    `;
    console.log("Username duplicate check result:", result);
    console.log("Result length:", result.length);

    // isActive가 true인 사용자만 확인
    const activeResult = await sql`
      SELECT id, username, "isActive" FROM users WHERE username = ${username} AND "isActive" = true
    `;
    console.log("Active username check result:", activeResult);

    const isDuplicate = activeResult.length > 0;
    return {
      success: true,
      isDuplicate,
      message: isDuplicate
        ? "이미 사용 중인 아이디입니다."
        : "사용 가능한 아이디입니다.",
    };
  } catch (error) {
    console.error("Check username duplicate error:", error);
    return {
      success: false,
      error: "아이디 중복 확인 중 오류가 발생했습니다.",
    };
  }
}

export async function checkEmailDuplicate(email: string) {
  try {
    console.log("Checking email duplicate for:", email);

    // 먼저 모든 이메일 확인
    const allEmails = await sql`SELECT email FROM users LIMIT 10`;
    console.log(
      "All emails in DB:",
      allEmails.map((u) => u.email)
    );

    // 특정 email 검색
    const result = await sql`
      SELECT id, email, "isActive" FROM users WHERE email = ${email}
    `;
    console.log("Email duplicate check result:", result);
    console.log("Result length:", result.length);

    // isActive가 true인 사용자만 확인
    const activeResult = await sql`
      SELECT id, email, "isActive" FROM users WHERE email = ${email} AND "isActive" = true
    `;
    console.log("Active email check result:", activeResult);

    const isDuplicate = activeResult.length > 0;
    return {
      success: true,
      isDuplicate,
      message: isDuplicate
        ? "이미 사용 중인 이메일입니다."
        : "사용 가능한 이메일입니다.",
    };
  } catch (error) {
    console.error("Check email duplicate error:", error);
    return {
      success: false,
      error: "이메일 중복 확인 중 오류가 발생했습니다.",
    };
  }
}

export interface VeterinarianRegisterData {
  userId: string;
  password: string;
  nickname: string;
  phone: string;
  email: string;
  birthDate: string;
  profileImage?: string;
  licenseImage?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

export async function registerVeterinarian(data: VeterinarianRegisterData) {
  try {
    console.log("SERVER: registerVeterinarian called with data:", data);

    const {
      userId,
      password,
      nickname,
      phone,
      email,
      birthDate,
      profileImage,
      licenseImage,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    } = data;

    console.log("SERVER: Extracted data:", {
      userId,
      password: "[HIDDEN]",
      nickname,
      phone,
      email,
      birthDate,
      profileImage,
      licenseImage,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    });

    // Check if user already exists
    console.log("SERVER: Checking for existing user...");
    const existingUser = await sql`
      SELECT id FROM users WHERE username = ${userId} OR email = ${email} OR phone = ${phone}
    `;
    console.log("SERVER: Existing user check result:", existingUser);

    if (existingUser.length > 0) {
      console.log("SERVER: User already exists");
      return {
        success: false,
        error: "이미 가입된 아이디, 이메일 또는 전화번호입니다.",
      };
    }

    // Hash password
    console.log("SERVER: Hashing password...");
    const passwordHash = await bcrypt.hash(password, 12);
    console.log("SERVER: Password hashed successfully");

    // Create user - userId는 username 필드에 저장
    console.log("SERVER: Creating user...");
    const generatedId = createId();
    console.log("SERVER: Generated ID:", generatedId);

    const userResult = await sql`
      INSERT INTO users (
        id, username, email, phone, "passwordHash", "userType", "profileImage", provider,
        "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${generatedId}, ${userId}, ${email}, ${phone}, ${passwordHash}, 'VETERINARIAN', ${profileImage}, 'NORMAL',
        ${termsAgreed ? new Date() : null}, ${
      privacyAgreed ? new Date() : null
    }, ${marketingAgreed ? new Date() : null},
        true, NOW(), NOW()
      )
      RETURNING *
    `;
    console.log("SERVER: User created successfully:", userResult[0]);

    const user = userResult[0];

    // Create veterinarian profile
    console.log("SERVER: Creating veterinarian profile...");
    const profileId = createId();
    console.log("SERVER: Generated profile ID:", profileId);

    const vetProfileResult = await sql`
      INSERT INTO veterinarian_profiles (
        id, "userId", nickname, "birthDate", "licenseImage", "createdAt", "updatedAt"
      )
      VALUES (
        ${profileId}, ${user.id}, ${nickname}, ${
      birthDate ? new Date(birthDate) : null
    }, ${licenseImage || null},
        NOW(), NOW()
      )
      RETURNING *
    `;
    console.log(
      "SERVER: Veterinarian profile created successfully:",
      vetProfileResult
    );

    console.log("SERVER: Registration completed successfully");
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    };
  } catch (error) {
    console.error("SERVER: Register veterinarian error:", error);
    console.error("SERVER: Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      data,
    });
    return {
      success: false,
      error: `수의사 회원가입 실패: ${
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      }`,
    };
  }
}
