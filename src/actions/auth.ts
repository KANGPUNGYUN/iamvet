"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { sql } from "@/lib/db";
import { generateTokens } from "@/lib/database";

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
  realName?: string; // 실명 추가
  birthDate?: Date; // 생년월일 추가
  userType: "VETERINARIAN" | "HOSPITAL" | "VETERINARY_STUDENT";
  profileImage?: string;
  provider: "NORMAL" | "GOOGLE" | "KAKAO" | "NAVER";
  isActive: boolean;
  termsAgreedAt?: Date;
  privacyAgreedAt?: Date;
  marketingAgreedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  profileName?: string; // 수의사: 닉네임, 병원: 병원명
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType?: "VETERINARIAN" | "HOSPITAL" | "VETERINARY_STUDENT";
}

export interface RegisterData {
  username: string;
  email: string;
  phone: string;
  realName?: string; // 실명 추가
  password: string;
  userType: "VETERINARIAN" | "HOSPITAL" | "VETERINARY_STUDENT";
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
    let result;

    if (userType === "VETERINARY_STUDENT") {
      // For veterinary students, check both VETERINARY_STUDENT and VETERINARIAN userTypes
      // since they might be stored as either depending on registration method
      result = await sql`
        SELECT * FROM users 
        WHERE email = ${email} 
        AND ("userType" = 'VETERINARY_STUDENT' OR "userType" = 'VETERINARIAN') 
        AND "isActive" = true
      `;
    } else if (userType) {
      result =
        await sql`SELECT * FROM users WHERE email = ${email} AND "userType" = ${userType} AND "isActive" = true`;
    } else {
      result =
        await sql`SELECT * FROM users WHERE email = ${email} AND "isActive" = true`;
    }

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
        realName: user.realName,
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
      realName,
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
        username, email, phone, "realName", "passwordHash", "userType", "profileImage",
        "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt"
      )
      VALUES (
        ${username}, ${email}, ${phone}, ${realName}, ${passwordHash}, ${userType}, ${profileImage},
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

    // Get profile-specific information based on user type
    let profileName = user.username; // fallback to username
    let actualUserType = user.userType; // will be modified for veterinary students

    console.log(
      "[getCurrentUser] Getting profile for userType:",
      user.userType,
      "userId:",
      user.id
    );

    if (
      user.userType === "VETERINARIAN" ||
      user.userType === "VETERINARY_STUDENT"
    ) {
      const vetProfile = await sql`
        SELECT nickname, experience, specialty FROM veterinarian_profiles WHERE "userId" = ${user.id} AND "deletedAt" IS NULL
      `;
      console.log(
        "[getCurrentUser] Veterinarian profile query result:",
        vetProfile
      );

      if (vetProfile.length > 0) {
        profileName = vetProfile[0].nickname;

        // Check if this is actually a veterinary student based on experience field
        if (
          vetProfile[0].experience &&
          vetProfile[0].experience.includes("Student at")
        ) {
          actualUserType = "VETERINARY_STUDENT";
          console.log(
            "[getCurrentUser] Detected as VETERINARY_STUDENT based on experience field"
          );
        }
      } else {
        console.log(
          "[getCurrentUser] No veterinarian profile found for user:",
          user.id
        );
      }
    } else if (user.userType === "HOSPITAL") {
      const hospitalProfile = await sql`
        SELECT "hospitalName" FROM hospital_profiles WHERE "userId" = ${user.id} AND "deletedAt" IS NULL
      `;
      if (hospitalProfile.length > 0) {
        profileName = hospitalProfile[0].hospitalName;
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        realName: user.realName,
        birthDate: user.birthDate,
        userType: actualUserType, // Use detected userType
        profileImage: user.profileImage,
        provider: user.provider,
        isActive: user.isActive,
        termsAgreedAt: user.termsAgreedAt,
        privacyAgreedAt: user.privacyAgreedAt,
        marketingAgreedAt: user.marketingAgreedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profileName: profileName, // Add profile-specific name
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
  userType: "VETERINARIAN" | "HOSPITAL" | "VETERINARY_STUDENT";
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

// 아이디 중복확인
export async function checkUsernameDuplicate(username: string): Promise<{
  success: boolean;
  isDuplicate?: boolean;
  message?: string;
  error?: string;
}> {
  try {
    console.log("[SERVER] checkUsernameDuplicate called with:", username);

    if (!username || username.trim() === "") {
      return { success: false, error: "아이디를 입력해주세요." };
    }

    const existingUser = await sql`
      SELECT id FROM users WHERE (username = ${username} OR "loginId" = ${username}) AND "isActive" = true
    `;

    const isDuplicate = existingUser.length > 0;

    return {
      success: true,
      isDuplicate,
      message: isDuplicate
        ? "이미 사용 중인 아이디입니다."
        : "사용 가능한 아이디입니다.",
    };
  } catch (error) {
    console.error("[SERVER] checkUsernameDuplicate error:", error);
    return {
      success: false,
      error: "아이디 중복확인 중 오류가 발생했습니다.",
    };
  }
}

// 이메일 중복확인
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
  realName?: string; // 실명 추가
  birthDate: string;
  profileImage?: string;
  licenseImage?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

export interface VeterinaryStudentRegisterData {
  userId: string;
  password: string;
  nickname: string;
  phone: string;
  universityEmail: string; // 대학교 이메일 추가
  realName?: string;
  birthDate: string;
  profileImage?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

export interface HospitalRegisterData {
  userId: string;
  password: string;
  hospitalName: string;
  businessNumber: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  profileImage?: string;
  businessLicense?: string;
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
      realName,
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
        id, username, email, phone, "realName", "passwordHash", "userType", "profileImage", provider,
        "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${generatedId}, ${userId}, ${email}, ${phone}, ${realName}, ${passwordHash}, 'VETERINARIAN', ${profileImage}, 'NORMAL',
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

    // Ensure licenseImage is handled properly for database constraints
    const processedLicenseImage = licenseImage || "";

    const vetProfileResult = await sql`
      INSERT INTO veterinarian_profiles (
        id, "userId", nickname, "birthDate", "licenseImage", "createdAt", "updatedAt"
      )
      VALUES (
        ${profileId}, ${user.id}, ${nickname}, ${
      birthDate ? new Date(birthDate) : null
    }, ${processedLicenseImage},
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

export async function registerVeterinaryStudent(
  data: VeterinaryStudentRegisterData
) {
  try {
    console.log("SERVER: registerVeterinaryStudent called with data:", data);

    const {
      userId,
      password,
      nickname,
      phone,
      universityEmail,
      realName,
      birthDate,
      profileImage,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    } = data;

    console.log("SERVER: Extracted data:", {
      userId,
      password: "[HIDDEN]",
      nickname,
      phone,
      universityEmail,
      realName,
      birthDate,
      profileImage,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    });

    // Check if user already exists
    console.log("SERVER: Checking for existing user...");
    const existingUser = await sql`
      SELECT id FROM users WHERE username = ${userId} OR email = ${universityEmail} OR phone = ${phone}
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
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("SERVER: Password hashed successfully");

    // Create user
    console.log("SERVER: Creating user...");
    const userId_generated = createId();
    const currentDate = new Date();
    const user = await sql`
      INSERT INTO users (
        id, username, email, phone, "passwordHash", "userType", "profileImage",
        provider, "isActive", "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt",
        "createdAt", "updatedAt"
      ) VALUES (
        ${userId_generated}, ${userId}, ${universityEmail}, ${phone}, ${hashedPassword}, 
        'VETERINARIAN', ${profileImage}, 'NORMAL', true,
        ${termsAgreed ? new Date() : null},
        ${privacyAgreed ? new Date() : null}, 
        ${marketingAgreed ? new Date() : null},
        ${currentDate}, ${currentDate}
      )
      RETURNING id, username, email, phone, "userType", "profileImage"
    `;
    console.log("SERVER: User created:", user[0]);

    // Create veterinarian profile for veterinary student (using existing table)
    console.log("SERVER: Creating veterinary student profile...");
    const profileId = createId();
    const universityDomain = universityEmail.split("@")[1] || "unknown";
    await sql`
      INSERT INTO veterinarian_profiles (
        id, "userId", nickname, "birthDate", "licenseImage", experience, specialty, introduction,
        "createdAt", "updatedAt"
      ) VALUES (
        ${profileId}, ${user[0].id}, ${nickname}, ${new Date(birthDate)}, null, 
        ${"Student at " + universityDomain}, 'Veterinary Student', 
        ${
          "University Email: " + universityEmail
        }, ${currentDate}, ${currentDate}
      )
    `;
    console.log("SERVER: Veterinary student profile created successfully");

    return {
      success: true,
      message: "수의학과 학생 회원가입이 완료되었습니다.",
    };
  } catch (error) {
    console.error("SERVER: Veterinary student registration error:", error);
    console.error("SERVER: Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      data,
    });

    return {
      success: false,
      error: `수의학과 학생 회원가입 중 오류가 발생했습니다: ${
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      }`,
    };
  }
}

export async function registerHospital(data: HospitalRegisterData) {
  try {
    console.log("SERVER: registerHospital called with data:", data);

    const {
      userId,
      password,
      hospitalName,
      businessNumber,
      phone,
      email,
      website,
      address,
      profileImage,
      businessLicense,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    } = data;

    console.log("SERVER: Extracted data:", {
      userId,
      password: "[HIDDEN]",
      hospitalName,
      businessNumber,
      phone,
      email,
      website,
      address,
      profileImage,
      businessLicense,
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

    // Check if business number already exists
    const existingBusiness = await sql`
      SELECT id FROM hospital_profiles WHERE "businessNumber" = ${businessNumber}
    `;

    if (existingBusiness.length > 0) {
      return {
        success: false,
        error: "이미 가입된 사업자등록번호입니다.",
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
        ${generatedId}, ${userId}, ${email}, ${phone}, ${passwordHash}, 'HOSPITAL', ${profileImage}, 'NORMAL',
        ${termsAgreed ? new Date() : null}, ${
      privacyAgreed ? new Date() : null
    }, ${marketingAgreed ? new Date() : null},
        true, NOW(), NOW()
      )
      RETURNING *
    `;
    console.log("SERVER: User created successfully:", userResult[0]);

    const user = userResult[0];

    // Create hospital profile
    console.log("SERVER: Creating hospital profile...");
    const profileId = createId();
    console.log("SERVER: Generated profile ID:", profileId);

    const hospitalProfileResult = await sql`
      INSERT INTO hospital_profiles (
        id, "userId", "hospitalName", "businessNumber", address, phone, website, "businessLicense", "createdAt", "updatedAt"
      )
      VALUES (
        ${profileId}, ${
      user.id
    }, ${hospitalName}, ${businessNumber}, ${address}, ${phone}, ${
      website || null
    }, ${businessLicense || null},
        NOW(), NOW()
      )
      RETURNING *
    `;
    console.log(
      "SERVER: Hospital profile created successfully:",
      hospitalProfileResult
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
    console.error("SERVER: Register hospital error:", error);
    console.error("SERVER: Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      data,
    });
    return {
      success: false,
      error: `병원 회원가입 실패: ${
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      }`,
    };
  }
}

export interface HospitalProfile {
  id: string;
  userId: string;
  hospitalName: string;
  businessNumber: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  businessLicense?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getHospitalProfile(): Promise<{
  success: boolean;
  profile?: HospitalProfile;
  error?: string;
}> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    if (userResult.user.userType !== "HOSPITAL") {
      return { success: false, error: "병원 계정이 아닙니다." };
    }

    const result = await sql`
      SELECT * FROM hospital_profiles 
      WHERE "userId" = ${userResult.user.id} 
      AND "deletedAt" IS NULL
    `;

    if (result.length === 0) {
      return { success: false, error: "병원 프로필을 찾을 수 없습니다." };
    }

    const profile = result[0];

    return {
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        hospitalName: profile.hospitalName,
        businessNumber: profile.businessNumber,
        address: profile.address,
        phone: profile.phone,
        website: profile.website,
        description: profile.description,
        businessLicense: profile.businessLicense,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  } catch (error) {
    console.error("Get hospital profile error:", error);
    return {
      success: false,
      error: "병원 프로필 조회 중 오류가 발생했습니다.",
    };
  }
}

export interface VeterinarianProfile {
  id: string;
  userId: string;
  nickname: string;
  birthDate?: Date;
  licenseImage?: string;
  experience?: string;
  specialty?: string;
  introduction?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getVeterinarianProfile(): Promise<{
  success: boolean;
  profile?: VeterinarianProfile;
  error?: string;
}> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    if (userResult.user.userType !== "VETERINARIAN") {
      return {
        success: false,
        error: "수의사 또는 수의학과 학생 계정이 아닙니다.",
      };
    }

    const result = await sql`
      SELECT * FROM veterinarian_profiles 
      WHERE "userId" = ${userResult.user.id} 
      AND "deletedAt" IS NULL
    `;

    if (result.length === 0) {
      return { success: false, error: "수의사 프로필을 찾을 수 없습니다." };
    }

    const profile = result[0];

    return {
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        nickname: profile.nickname,
        birthDate: profile.birthDate,
        licenseImage: profile.licenseImage,
        experience: profile.experience,
        specialty: profile.specialty,
        introduction: profile.introduction,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  } catch (error) {
    console.error("Get veterinarian profile error:", error);
    return {
      success: false,
      error: "수의사 프로필 조회 중 오류가 발생했습니다.",
    };
  }
}

// 상세 이력서 타입 정의
export interface DetailedResumeData {
  // 기본 정보
  photo?: string;
  name: string;
  birthDate?: string;
  introduction?: string;
  phone?: string;
  email?: string;
  phonePublic: boolean;
  emailPublic: boolean;

  // 희망 근무 조건
  position?: string;
  specialties: string[];
  preferredRegions: string[];
  expectedSalary?: string;
  workTypes: string[];
  startDate?: string;
  preferredWeekdays: string[];
  weekdaysNegotiable: boolean;
  workStartTime?: string;
  workEndTime?: string;
  workTimeNegotiable: boolean;

  // 자기소개
  selfIntroduction?: string;

  // 복잡한 객체들
  experiences: Array<{
    hospitalName: string;
    mainTasks: string;
    startDate?: Date;
    endDate?: Date;
  }>;
  licenses: Array<{
    name: string;
    issuer: string;
    grade?: string;
    acquiredDate?: Date;
  }>;
  educations: Array<{
    degree: string;
    graduationStatus: string;
    schoolName: string;
    major: string;
    gpa?: string;
    totalGpa?: string;
    startDate?: Date;
    endDate?: Date;
  }>;
  medicalCapabilities: Array<{
    field: string;
    proficiency: string;
    description?: string;
    others?: string;
  }>;
}

export interface DetailedResume {
  id: string;
  userId: string;
  photo?: string;
  name: string;
  birthDate?: string;
  introduction?: string;
  phone?: string;
  email?: string;
  phonePublic: boolean;
  emailPublic: boolean;
  position?: string;
  specialties: string[];
  preferredRegions: string[];
  expectedSalary?: string;
  workTypes: string[];
  startDate?: string;
  preferredWeekdays: string[];
  weekdaysNegotiable: boolean;
  workStartTime?: string;
  workEndTime?: string;
  workTimeNegotiable: boolean;
  selfIntroduction?: string;
  createdAt: Date;
  updatedAt: Date;
  experiences: Array<{
    id: string;
    hospitalName: string;
    mainTasks: string;
    startDate?: Date;
    endDate?: Date;
  }>;
  licenses: Array<{
    id: string;
    name: string;
    issuer: string;
    grade?: string;
    acquiredDate?: Date;
  }>;
  educations: Array<{
    id: string;
    degree: string;
    graduationStatus: string;
    schoolName: string;
    major: string;
    gpa?: string;
    totalGpa?: string;
    startDate?: Date;
    endDate?: Date;
  }>;
  medicalCapabilities: Array<{
    id: string;
    field: string;
    proficiency: string;
    description?: string;
    others?: string;
  }>;
}

// 상세 이력서 조회
export async function getDetailedResume(): Promise<{
  success: boolean;
  resume?: DetailedResume;
  error?: string;
}> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    if (userResult.user.userType !== "VETERINARIAN") {
      return {
        success: false,
        error: "수의사 또는 수의학과 학생 계정이 아닙니다.",
      };
    }

    // 메인 이력서 정보 조회
    const resumeResult = await sql`
      SELECT * FROM detailed_resumes 
      WHERE "userId" = ${userResult.user.id} 
      AND "deletedAt" IS NULL
    `;

    if (resumeResult.length === 0) {
      return { success: false, error: "이력서를 찾을 수 없습니다." };
    }

    const resume = resumeResult[0];

    // 관련 데이터들 조회
    const [experiences, licenses, educations, medicalCapabilities] =
      await Promise.all([
        sql`SELECT * FROM resume_experiences WHERE "resumeId" = ${resume.id} ORDER BY "sortOrder", "createdAt"`,
        sql`SELECT * FROM resume_licenses WHERE "resumeId" = ${resume.id} ORDER BY "sortOrder", "createdAt"`,
        sql`SELECT * FROM resume_educations WHERE "resumeId" = ${resume.id} ORDER BY "sortOrder", "createdAt"`,
        sql`SELECT * FROM resume_medical_capabilities WHERE "resumeId" = ${resume.id} ORDER BY "sortOrder", "createdAt"`,
      ]);

    return {
      success: true,
      resume: {
        id: resume.id,
        userId: resume.userId,
        photo: resume.photo,
        name: resume.name,
        birthDate: resume.birthDate,
        introduction: resume.introduction,
        phone: resume.phone,
        email: resume.email,
        phonePublic: resume.phonePublic,
        emailPublic: resume.emailPublic,
        position: resume.position,
        specialties: resume.specialties,
        preferredRegions: resume.preferredRegions,
        expectedSalary: resume.expectedSalary,
        workTypes: resume.workTypes,
        startDate: resume.startDate,
        preferredWeekdays: resume.preferredWeekdays,
        weekdaysNegotiable: resume.weekdaysNegotiable,
        workStartTime: resume.workStartTime,
        workEndTime: resume.workEndTime,
        workTimeNegotiable: resume.workTimeNegotiable,
        selfIntroduction: resume.selfIntroduction,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        experiences: experiences.map((exp) => ({
          id: exp.id,
          hospitalName: exp.hospitalName,
          mainTasks: exp.mainTasks,
          startDate: exp.startDate,
          endDate: exp.endDate,
        })),
        licenses: licenses.map((lic) => ({
          id: lic.id,
          name: lic.name,
          issuer: lic.issuer,
          grade: lic.grade,
          acquiredDate: lic.acquiredDate,
        })),
        educations: educations.map((edu) => ({
          id: edu.id,
          degree: edu.degree,
          graduationStatus: edu.graduationStatus,
          schoolName: edu.schoolName,
          major: edu.major,
          gpa: edu.gpa,
          totalGpa: edu.totalGpa,
          startDate: edu.startDate,
          endDate: edu.endDate,
        })),
        medicalCapabilities: medicalCapabilities.map((cap) => ({
          id: cap.id,
          field: cap.field,
          proficiency: cap.proficiency,
          description: cap.description,
          others: cap.others,
        })),
      },
    };
  } catch (error) {
    console.error("Get detailed resume error:", error);
    return {
      success: false,
      error: "이력서 조회 중 오류가 발생했습니다.",
    };
  }
}

// 상세 이력서 저장/업데이트
export async function saveDetailedResume(data: DetailedResumeData): Promise<{
  success: boolean;
  resumeId?: string;
  error?: string;
}> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    if (userResult.user.userType !== "VETERINARIAN") {
      return {
        success: false,
        error: "수의사 또는 수의학과 학생 계정이 아닙니다.",
      };
    }

    const userId = userResult.user.id;

    // 기존 이력서가 있는지 확인
    const existingResume = await sql`
      SELECT id FROM detailed_resumes 
      WHERE "userId" = ${userId} 
      AND "deletedAt" IS NULL
    `;

    let resumeId: string;

    if (existingResume.length > 0) {
      // 업데이트
      resumeId = existingResume[0].id;

      await sql`
        UPDATE detailed_resumes SET
          photo = ${data.photo || null},
          name = ${data.name},
          "birthDate" = ${data.birthDate || null},
          introduction = ${data.introduction || null},
          phone = ${data.phone || null},
          email = ${data.email || null},
          "phonePublic" = ${data.phonePublic},
          "emailPublic" = ${data.emailPublic},
          position = ${data.position || null},
          specialties = ${data.specialties},
          "preferredRegions" = ${data.preferredRegions},
          "expectedSalary" = ${data.expectedSalary || null},
          "workTypes" = ${data.workTypes},
          "startDate" = ${data.startDate || null},
          "preferredWeekdays" = ${data.preferredWeekdays},
          "weekdaysNegotiable" = ${data.weekdaysNegotiable},
          "workStartTime" = ${data.workStartTime || null},
          "workEndTime" = ${data.workEndTime || null},
          "workTimeNegotiable" = ${data.workTimeNegotiable},
          "selfIntroduction" = ${data.selfIntroduction || null},
          "updatedAt" = NOW()
        WHERE id = ${resumeId}
      `;

      // 기존 관련 데이터 삭제
      await Promise.all([
        sql`DELETE FROM resume_experiences WHERE "resumeId" = ${resumeId}`,
        sql`DELETE FROM resume_licenses WHERE "resumeId" = ${resumeId}`,
        sql`DELETE FROM resume_educations WHERE "resumeId" = ${resumeId}`,
        sql`DELETE FROM resume_medical_capabilities WHERE "resumeId" = ${resumeId}`,
      ]);
    } else {
      // 생성
      resumeId = createId();

      await sql`
        INSERT INTO detailed_resumes (
          id, "userId", photo, name, "birthDate", introduction, phone, email,
          "phonePublic", "emailPublic", position, specialties, "preferredRegions",
          "expectedSalary", "workTypes", "startDate", "preferredWeekdays",
          "weekdaysNegotiable", "workStartTime", "workEndTime", "workTimeNegotiable",
          "selfIntroduction", "createdAt", "updatedAt"
        ) VALUES (
          ${resumeId}, ${userId}, ${data.photo || null}, ${data.name},
          ${data.birthDate || null}, ${data.introduction || null},
          ${data.phone || null}, ${data.email || null}, ${data.phonePublic},
          ${data.emailPublic}, ${data.position || null}, ${data.specialties},
          ${data.preferredRegions}, ${data.expectedSalary || null}, ${
        data.workTypes
      },
          ${data.startDate || null}, ${data.preferredWeekdays}, ${
        data.weekdaysNegotiable
      },
          ${data.workStartTime || null}, ${data.workEndTime || null}, ${
        data.workTimeNegotiable
      },
          ${data.selfIntroduction || null}, NOW(), NOW()
        )
      `;
    }

    // 경력사항 저장
    if (data.experiences && data.experiences.length > 0) {
      for (let i = 0; i < data.experiences.length; i++) {
        const exp = data.experiences[i];
        await sql`
          INSERT INTO resume_experiences (
            id, "resumeId", "hospitalName", "mainTasks", "startDate", "endDate", "sortOrder", "createdAt", "updatedAt"
          ) VALUES (
            ${createId()}, ${resumeId}, ${exp.hospitalName}, ${exp.mainTasks},
            ${exp.startDate || null}, ${exp.endDate || null}, ${i}, NOW(), NOW()
          )
        `;
      }
    }

    // 자격증 저장
    if (data.licenses && data.licenses.length > 0) {
      for (let i = 0; i < data.licenses.length; i++) {
        const lic = data.licenses[i];
        await sql`
          INSERT INTO resume_licenses (
            id, "resumeId", name, issuer, grade, "acquiredDate", "sortOrder", "createdAt", "updatedAt"
          ) VALUES (
            ${createId()}, ${resumeId}, ${lic.name}, ${lic.issuer},
            ${lic.grade || null}, ${
          lic.acquiredDate || null
        }, ${i}, NOW(), NOW()
          )
        `;
      }
    }

    // 학력 저장
    if (data.educations && data.educations.length > 0) {
      for (let i = 0; i < data.educations.length; i++) {
        const edu = data.educations[i];
        await sql`
          INSERT INTO resume_educations (
            id, "resumeId", degree, "graduationStatus", "schoolName", major,
            gpa, "totalGpa", "startDate", "endDate", "sortOrder", "createdAt", "updatedAt"
          ) VALUES (
            ${createId()}, ${resumeId}, ${edu.degree}, ${edu.graduationStatus},
            ${edu.schoolName}, ${edu.major}, ${edu.gpa || null}, ${
          edu.totalGpa || null
        },
            ${edu.startDate || null}, ${edu.endDate || null}, ${i}, NOW(), NOW()
          )
        `;
      }
    }

    // 진료상세역량 저장
    if (data.medicalCapabilities && data.medicalCapabilities.length > 0) {
      for (let i = 0; i < data.medicalCapabilities.length; i++) {
        const cap = data.medicalCapabilities[i];
        await sql`
          INSERT INTO resume_medical_capabilities (
            id, "resumeId", field, proficiency, description, others, "sortOrder", "createdAt", "updatedAt"
          ) VALUES (
            ${createId()}, ${resumeId}, ${cap.field}, ${cap.proficiency},
            ${cap.description || null}, ${
          cap.others || null
        }, ${i}, NOW(), NOW()
          )
        `;
      }
    }

    return {
      success: true,
      resumeId: resumeId,
    };
  } catch (error) {
    console.error("Save detailed resume error:", error);
    return {
      success: false,
      error: "이력서 저장 중 오류가 발생했습니다.",
    };
  }
}

// 상세 병원 프로필 타입 정의
export interface DetailedHospitalProfileData {
  // 기본 정보
  hospitalLogo?: string;
  hospitalName: string;
  businessNumber: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  businessLicense?: string;

  // 추가 상세 정보
  establishedDate?: string;
  detailAddress?: string;
  email?: string;
  treatmentAnimals: string[];
  treatmentFields: string[];

  // 운영 정보
  operatingHours?: any; // JSON 데이터
  emergencyService: boolean;
  parkingAvailable: boolean;
  publicTransportInfo?: string;

  // 시설 정보
  totalBeds?: number;
  surgeryRooms?: number;
  xrayRoom: boolean;
  ctScan: boolean;
  ultrasound: boolean;

  // 추가 서비스
  grooming: boolean;
  boarding: boolean;
  petTaxi: boolean;

  // 인증 정보
  certifications: string[];
  awards: string[];

  // 관계 데이터
  staff?: Array<{
    name: string;
    position: string;
    specialization?: string;
    experience?: string;
    education?: string;
    profileImage?: string;
    introduction?: string;
  }>;
  equipments?: Array<{
    name: string;
    category: string;
    manufacturer?: string;
    model?: string;
    purchaseDate?: Date;
    description?: string;
    image?: string;
  }>;
}

export interface DetailedHospitalProfile {
  id: string;
  userId: string;
  hospitalLogo?: string;
  hospitalName: string;
  businessNumber: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  businessLicense?: string;
  establishedDate?: string;
  detailAddress?: string;
  email?: string;
  treatmentAnimals: string[];
  treatmentFields: string[];
  operatingHours?: any;
  emergencyService: boolean;
  parkingAvailable: boolean;
  publicTransportInfo?: string;
  totalBeds?: number;
  surgeryRooms?: number;
  xrayRoom: boolean;
  ctScan: boolean;
  ultrasound: boolean;
  grooming: boolean;
  boarding: boolean;
  petTaxi: boolean;
  certifications: string[];
  awards: string[];
  createdAt: Date;
  updatedAt: Date;
  staff: Array<{
    id: string;
    name: string;
    position: string;
    specialization?: string;
    experience?: string;
    education?: string;
    profileImage?: string;
    introduction?: string;
  }>;
  equipments: Array<{
    id: string;
    name: string;
    category: string;
    manufacturer?: string;
    model?: string;
    purchaseDate?: Date;
    description?: string;
    image?: string;
  }>;
}

// 상세 병원 프로필 조회
export async function getDetailedHospitalProfile(): Promise<{
  success: boolean;
  profile?: DetailedHospitalProfile;
  error?: string;
}> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    if (userResult.user.userType !== "HOSPITAL") {
      return { success: false, error: "병원 계정이 아닙니다." };
    }

    // 메인 프로필 정보 조회
    const profileResult = await sql`
      SELECT * FROM detailed_hospital_profiles 
      WHERE "userId" = ${userResult.user.id} 
      AND "deletedAt" IS NULL
    `;

    if (profileResult.length === 0) {
      return { success: false, error: "병원 프로필을 찾을 수 없습니다." };
    }

    const profile = profileResult[0];

    // 관련 데이터들 조회
    const [staff, equipments] = await Promise.all([
      sql`SELECT * FROM hospital_staff WHERE "hospitalProfileId" = ${profile.id} ORDER BY "sortOrder", "createdAt"`,
      sql`SELECT * FROM hospital_equipments WHERE "hospitalProfileId" = ${profile.id} ORDER BY "sortOrder", "createdAt"`,
    ]);

    return {
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        hospitalLogo: profile.hospitalLogo,
        hospitalName: profile.hospitalName,
        businessNumber: profile.businessNumber,
        address: profile.address,
        phone: profile.phone,
        website: profile.website,
        description: profile.description,
        businessLicense: profile.businessLicense,
        establishedDate: profile.establishedDate,
        detailAddress: profile.detailAddress,
        email: profile.email,
        treatmentAnimals: profile.treatmentAnimals,
        treatmentFields: profile.treatmentFields,
        operatingHours: profile.operatingHours,
        emergencyService: profile.emergencyService,
        parkingAvailable: profile.parkingAvailable,
        publicTransportInfo: profile.publicTransportInfo,
        totalBeds: profile.totalBeds,
        surgeryRooms: profile.surgeryRooms,
        xrayRoom: profile.xrayRoom,
        ctScan: profile.ctScan,
        ultrasound: profile.ultrasound,
        grooming: profile.grooming,
        boarding: profile.boarding,
        petTaxi: profile.petTaxi,
        certifications: profile.certifications,
        awards: profile.awards,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        staff: staff.map((s) => ({
          id: s.id,
          name: s.name,
          position: s.position,
          specialization: s.specialization,
          experience: s.experience,
          education: s.education,
          profileImage: s.profileImage,
          introduction: s.introduction,
        })),
        equipments: equipments.map((e) => ({
          id: e.id,
          name: e.name,
          category: e.category,
          manufacturer: e.manufacturer,
          model: e.model,
          purchaseDate: e.purchaseDate,
          description: e.description,
          image: e.image,
        })),
      },
    };
  } catch (error) {
    console.error("Get detailed hospital profile error:", error);
    return {
      success: false,
      error: "병원 프로필 조회 중 오류가 발생했습니다.",
    };
  }
}

// 상세 병원 프로필 저장/업데이트
export async function saveDetailedHospitalProfile(
  data: DetailedHospitalProfileData
): Promise<{
  success: boolean;
  profileId?: string;
  error?: string;
}> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "인증되지 않은 사용자입니다." };
    }

    if (userResult.user.userType !== "HOSPITAL") {
      return { success: false, error: "병원 계정이 아닙니다." };
    }

    const userId = userResult.user.id;

    // 기존 프로필이 있는지 확인
    const existingProfile = await sql`
      SELECT id FROM detailed_hospital_profiles 
      WHERE "userId" = ${userId} 
      AND "deletedAt" IS NULL
    `;

    let profileId: string;

    if (existingProfile.length > 0) {
      // 업데이트
      profileId = existingProfile[0].id;

      await sql`
        UPDATE detailed_hospital_profiles SET
          "hospitalLogo" = ${data.hospitalLogo || null},
          "hospitalName" = ${data.hospitalName},
          "businessNumber" = ${data.businessNumber},
          address = ${data.address},
          phone = ${data.phone},
          website = ${data.website || null},
          description = ${data.description || null},
          "businessLicense" = ${data.businessLicense || null},
          "establishedDate" = ${data.establishedDate || null},
          "detailAddress" = ${data.detailAddress || null},
          email = ${data.email || null},
          "treatmentAnimals" = ${data.treatmentAnimals},
          "treatmentFields" = ${data.treatmentFields},
          "operatingHours" = ${data.operatingHours || null},
          "emergencyService" = ${data.emergencyService},
          "parkingAvailable" = ${data.parkingAvailable},
          "publicTransportInfo" = ${data.publicTransportInfo || null},
          "totalBeds" = ${data.totalBeds || null},
          "surgeryRooms" = ${data.surgeryRooms || null},
          "xrayRoom" = ${data.xrayRoom},
          "ctScan" = ${data.ctScan},
          ultrasound = ${data.ultrasound},
          grooming = ${data.grooming},
          boarding = ${data.boarding},
          "petTaxi" = ${data.petTaxi},
          certifications = ${data.certifications},
          awards = ${data.awards},
          "updatedAt" = NOW()
        WHERE id = ${profileId}
      `;

      // 기존 관련 데이터 삭제
      await Promise.all([
        sql`DELETE FROM hospital_staff WHERE "hospitalProfileId" = ${profileId}`,
        sql`DELETE FROM hospital_equipments WHERE "hospitalProfileId" = ${profileId}`,
      ]);
    } else {
      // 생성
      profileId = createId();

      await sql`
        INSERT INTO detailed_hospital_profiles (
          id, "userId", "hospitalLogo", "hospitalName", "businessNumber", address, phone,
          website, description, "businessLicense", "establishedDate", "detailAddress",
          email, "treatmentAnimals", "treatmentFields", "operatingHours", "emergencyService",
          "parkingAvailable", "publicTransportInfo", "totalBeds", "surgeryRooms", "xrayRoom",
          "ctScan", ultrasound, grooming, boarding, "petTaxi", certifications, awards,
          "createdAt", "updatedAt"
        ) VALUES (
          ${profileId}, ${userId}, ${data.hospitalLogo || null}, ${
        data.hospitalName
      },
          ${data.businessNumber}, ${data.address}, ${data.phone}, ${
        data.website || null
      },
          ${data.description || null}, ${data.businessLicense || null}, ${
        data.establishedDate || null
      },
          ${data.detailAddress || null}, ${data.email || null}, ${
        data.treatmentAnimals
      },
          ${data.treatmentFields}, ${data.operatingHours || null}, ${
        data.emergencyService
      },
          ${data.parkingAvailable}, ${data.publicTransportInfo || null}, ${
        data.totalBeds || null
      },
          ${data.surgeryRooms || null}, ${data.xrayRoom}, ${data.ctScan}, ${
        data.ultrasound
      },
          ${data.grooming}, ${data.boarding}, ${data.petTaxi}, ${
        data.certifications
      },
          ${data.awards}, NOW(), NOW()
        )
      `;
    }

    // 직원 정보 저장
    if (data.staff && data.staff.length > 0) {
      for (let i = 0; i < data.staff.length; i++) {
        const staff = data.staff[i];
        await sql`
          INSERT INTO hospital_staff (
            id, "hospitalProfileId", name, position, specialization, experience, education,
            "profileImage", introduction, "sortOrder", "createdAt", "updatedAt"
          ) VALUES (
            ${createId()}, ${profileId}, ${staff.name}, ${staff.position},
            ${staff.specialization || null}, ${staff.experience || null}, ${
          staff.education || null
        },
            ${staff.profileImage || null}, ${
          staff.introduction || null
        }, ${i}, NOW(), NOW()
          )
        `;
      }
    }

    // 장비 정보 저장
    if (data.equipments && data.equipments.length > 0) {
      for (let i = 0; i < data.equipments.length; i++) {
        const equipment = data.equipments[i];
        await sql`
          INSERT INTO hospital_equipments (
            id, "hospitalProfileId", name, category, manufacturer, model, "purchaseDate",
            description, image, "sortOrder", "createdAt", "updatedAt"
          ) VALUES (
            ${createId()}, ${profileId}, ${equipment.name}, ${
          equipment.category
        },
            ${equipment.manufacturer || null}, ${equipment.model || null}, ${
          equipment.purchaseDate || null
        },
            ${equipment.description || null}, ${
          equipment.image || null
        }, ${i}, NOW(), NOW()
          )
        `;
      }
    }

    return {
      success: true,
      profileId: profileId,
    };
  } catch (error) {
    console.error("Save detailed hospital profile error:", error);
    return {
      success: false,
      error: "병원 프로필 저장 중 오류가 발생했습니다.",
    };
  }
}

// Social Registration Completion Functions
interface SocialVeterinarianRegistrationData {
  email: string;
  name: string;
  realName?: string;
  profileImage?: string;
  provider: string;
  providerId: string;
  nickname: string;
  phone: string;
  birthDate?: string;
  licenseImage?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}

interface SocialVeterinaryStudentRegistrationData {
  email: string;
  name: string;
  realName?: string;
  profileImage?: string;
  provider: string;
  providerId: string;
  nickname: string;
  phone: string;
  universityEmail: string;
  birthDate?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}

export async function completeSocialVeterinarianRegistration(
  data: SocialVeterinarianRegistrationData
) {
  try {
    console.log(
      "SERVER: completeSocialVeterinarianRegistration called with data:",
      data
    );

    const {
      email,
      name,
      realName,
      profileImage,
      provider,
      providerId,
      nickname,
      phone,
      birthDate,
      licenseImage,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    } = data;

    // Check if social user already exists
    const existingSocialUser = await sql`
      SELECT u.*, sa.* FROM users u 
      JOIN social_accounts sa ON u.id = sa."userId" 
      WHERE sa.provider = ${provider} AND sa."providerId" = ${providerId}
    `;

    if (existingSocialUser.length > 0) {
      return {
        success: false,
        error: "이미 가입된 소셜 계정입니다.",
      };
    }

    // Check if email already exists
    const existingEmailUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingEmailUser.length > 0) {
      return {
        success: false,
        error: "이미 가입된 이메일입니다.",
      };
    }

    // Create user
    const userId = createId();
    const currentDate = new Date();

    const userResult = await sql`
      INSERT INTO users (
        id, username, email, phone, nickname, "realName", "birthDate", "passwordHash", "userType", "profileImage", provider,
        "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${userId}, ${email}, ${email}, ${phone}, ${nickname}, ${realName || name}, ${
      birthDate ? new Date(birthDate) : null
    }, null, 'VETERINARIAN', ${profileImage}, ${provider.toUpperCase()},
        ${termsAgreed ? currentDate : null}, ${
      privacyAgreed ? currentDate : null
    }, ${marketingAgreed ? currentDate : null},
        true, ${currentDate}, ${currentDate}
      )
      RETURNING *
    `;

    const user = userResult[0];

    // Create social account link
    const socialAccountId = createId();
    await sql`
      INSERT INTO social_accounts (id, "userId", provider, "providerId", "accessToken", "refreshToken", "createdAt", "updatedAt")
      VALUES (${socialAccountId}, ${
      user.id
    }, ${provider.toUpperCase()}, ${providerId}, null, null, ${currentDate}, ${currentDate})
    `;

    // Create veterinarian profile
    const profileId = createId();
    await sql`
      INSERT INTO veterinarian_profiles (
        id, "userId", nickname, "birthDate", "licenseImage", "createdAt", "updatedAt"
      )
      VALUES (
        ${profileId}, ${user.id}, ${nickname}, ${
      birthDate ? new Date(birthDate) : null
    }, ${licenseImage || null},
        ${currentDate}, ${currentDate}
      )
    `;

    // Generate tokens for the new user
    const tokens = await generateTokens(user);

    // Set auth cookie
    const cookieStore = await cookies();
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    cookieStore.set("auth-token", tokens.accessToken, {
      expires: expireDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
      tokens,
    };
  } catch (error) {
    console.error(
      "SERVER: Complete social veterinarian registration error:",
      error
    );
    return {
      success: false,
      error: `소셜 수의사 회원가입 완료 실패: ${
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      }`,
    };
  }
}

export async function completeSocialVeterinaryStudentRegistration(
  data: SocialVeterinaryStudentRegistrationData
) {
  try {
    console.log(
      "SERVER: completeSocialVeterinaryStudentRegistration called with data:",
      data
    );

    const {
      // email: socialEmail, // Not used in veterinary student registration
      name,
      realName,
      profileImage,
      provider,
      providerId,
      nickname,
      phone,
      universityEmail,
      birthDate,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
    } = data;

    // Check if social user already exists
    const existingSocialUser = await sql`
      SELECT u.*, sa.* FROM users u 
      JOIN social_accounts sa ON u.id = sa."userId" 
      WHERE sa.provider = ${provider} AND sa."providerId" = ${providerId}
    `;

    if (existingSocialUser.length > 0) {
      return {
        success: false,
        error: "이미 가입된 소셜 계정입니다.",
      };
    }

    // Check if university email already exists
    const existingEmailUser = await sql`
      SELECT id FROM users WHERE email = ${universityEmail}
    `;

    if (existingEmailUser.length > 0) {
      return {
        success: false,
        error: "이미 가입된 대학교 이메일입니다.",
      };
    }

    // Create user
    const userId = createId();
    const currentDate = new Date();

    const userResult = await sql`
      INSERT INTO users (
        id, username, email, phone, nickname, "realName", "birthDate", "passwordHash", "userType", "profileImage", provider,
        "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${userId}, ${universityEmail}, ${universityEmail}, ${phone}, ${nickname}, ${
      realName || name
    }, ${
      birthDate ? new Date(birthDate) : null
    }, null, 'VETERINARIAN', ${profileImage}, ${provider.toUpperCase()},
        ${termsAgreed ? currentDate : null}, ${
      privacyAgreed ? currentDate : null
    }, ${marketingAgreed ? currentDate : null},
        true, ${currentDate}, ${currentDate}
      )
      RETURNING *
    `;

    const user = userResult[0];

    // Create social account link
    const socialAccountId = createId();
    await sql`
      INSERT INTO social_accounts (id, "userId", provider, "providerId", "accessToken", "refreshToken", "createdAt", "updatedAt")
      VALUES (${socialAccountId}, ${
      user.id
    }, ${provider.toUpperCase()}, ${providerId}, null, null, ${currentDate}, ${currentDate})
    `;

    // Create veterinarian profile for veterinary student
    const profileId = createId();
    const universityDomain = universityEmail.split("@")[1] || "unknown";
    await sql`
      INSERT INTO veterinarian_profiles (
        id, "userId", nickname, "birthDate", "licenseImage", experience, specialty, introduction,
        "createdAt", "updatedAt"
      )
      VALUES (
        ${profileId}, ${user.id}, ${nickname}, ${
      birthDate ? new Date(birthDate) : null
    }, null,
        ${"Student at " + universityDomain}, 'Veterinary Student',
        ${
          "University Email: " + universityEmail
        }, ${currentDate}, ${currentDate}
      )
    `;

    // Generate tokens for the new user
    const tokens = await generateTokens(user);

    // Set auth cookie
    const cookieStore = await cookies();
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    cookieStore.set("auth-token", tokens.accessToken, {
      expires: expireDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
      tokens,
    };
  } catch (error) {
    console.error(
      "SERVER: Complete social veterinary student registration error:",
      error
    );
    return {
      success: false,
      error: `소셜 수의학과 학생 회원가입 완료 실패: ${
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      }`,
    };
  }
}
