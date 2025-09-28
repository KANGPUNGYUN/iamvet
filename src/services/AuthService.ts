import {
  getUserByEmail,
  getUserBySocialProvider,
  createSocialUser,
  linkSocialAccount,
  generateTokens,
} from "@/lib/database";
import {
  AuthResponse,
  SocialUser,
  SocialLoginResponse,
  ProfileCompleteness,
} from "@/types/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Auth Service Layer - Central business logic for authentication
 *
 * Shared between Server Actions and API Routes according to PROJECT_ARCHITECTURE.md
 * Handles both traditional and social authentication flows
 */
export class AuthService {
  /**
   * Map frontend user types to database enum values
   */
  private static mapUserTypeToDbEnum(userType: string): string {
    const mapping: { [key: string]: string } = {
      veterinarian: "VETERINARIAN",
      hospital: "HOSPITAL",
      "veterinary-student": "VETERINARIAN", // Store as VETERINARIAN in DB for now
    };
    return mapping[userType] || "VETERINARIAN";
  }

  /**
   * Handle social authentication flow
   * Used by all OAuth callback routes (Google, Kakao, Naver)
   */
  static async handleSocialAuth(socialUserData: {
    email: string;
    name: string;
    realName?: string;
    phone?: string;
    birthDate?: string;
    profileImage?: string;
    userType: string;
    provider: "GOOGLE" | "KAKAO" | "NAVER";
    providerId: string;
    socialData: any;
  }): Promise<AuthResponse<SocialLoginResponse>> {
    try {
      const {
        email,
        name,
        realName,
        phone,
        birthDate,
        profileImage,
        userType,
        provider,
        providerId,
        socialData,
      } = socialUserData;

      // Convert userType to database-compatible format
      const dbUserType = this.mapUserTypeToDbEnum(userType);

      // Check if user exists by social provider
      console.log("Checking user by social provider:", provider, providerId);
      let user = await getUserBySocialProvider(provider, providerId);
      console.log("User found by social provider:", !!user);

      if (!user) {
        // Check if user exists with same email
        console.log("Checking user by email:", email);
        const existingUser = await getUserByEmail(email);
        console.log("Existing user found by email:", !!existingUser);

        if (existingUser) {
          // Link social account to existing user
          await linkSocialAccount(existingUser.id, {
            provider,
            providerId,
            email,
            name,
            profileImage,
          });
          user = existingUser;
        } else {
          // For new users, don't create user yet - redirect to registration completion
          return {
            success: true,
            data: {
              user: null,
              tokens: null,
              isNewUser: true,
              isProfileComplete: false,
              // Pass social data for registration completion
              socialData: {
                email,
                name,
                realName,
                phone,
                birthDate,
                profileImage,
                provider,
                providerId,
                userType,
              },
            },
            message: `${provider} 로그인 성공 - 회원가입 완료 필요`,
          };
        }
      }

      // At this point, we have an existing user
      // Check profile completeness - use original userType for logic
      const isProfileComplete = await this.checkProfileComplete(user.id, userType);

      // Generate tokens for existing user
      const tokens = await generateTokens(user);

      // Get user's profile information from database for phone and birthDate
      let userPhone = user.phone || phone; // Use DB phone first, fallback to social phone
      let userBirthDate = birthDate; // Start with social birthDate
      let userRealName = user.realName || realName || name; // Use DB realName first
      
      // Get additional profile info from veterinarian_profiles if needed
      if (userType === 'veterinarian' || userType === 'veterinary-student') {
        try {
          const profile = await prisma.veterinarian_profiles.findUnique({
            where: { userId: user.id },
          });
          if (profile) {
            userBirthDate = profile.birthDate ? profile.birthDate.toISOString().split('T')[0] : userBirthDate;
          }
        } catch (error) {
          console.error('Failed to fetch veterinarian profile:', error);
        }
      }

      // Prepare response for existing user
      const responseData: SocialLoginResponse = {
        user: {
          id: user.id,
          email: user.email,
          name,
          realName: userRealName,
          phone: userPhone,
          birthDate: userBirthDate,
          profileImage,
          provider,
          providerId,
          userType: userType, // Return original userType for frontend
          socialAccounts: user.socialAccounts || [],
        },
        tokens,
        isNewUser: false, // This is an existing user
        isProfileComplete,
      };

      return {
        success: true,
        data: responseData,
        message: `${provider} 로그인 성공`,
      };
    } catch (error) {
      console.error("Social auth error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "소셜 로그인 처리 중 오류가 발생했습니다",
      };
    }
  }

  /**
   * Check if user profile is complete using Prisma
   */
  static async checkProfileComplete(userId: string, userType: string): Promise<boolean> {
    try {
      if (userType === 'VETERINARIAN' || userType === 'veterinary-student') {
        // Check veterinarian_profiles table for profile completion
        const profile = await prisma.veterinarian_profiles.findUnique({
          where: { userId },
        });
        return !!profile;
      } else if (userType === 'HOSPITAL' || userType === 'hospital') {
        const profile = await prisma.hospitals.findUnique({
          where: { userId },
        });
        return !!profile;
      }
      return false;
    } catch (error) {
      console.error("Profile completeness check error:", error);
      return false;
    }
  }

  /**
   * Check if user profile is complete
   */
  static async checkProfileCompleteness(
    userId: string,
    userType: string
  ): Promise<AuthResponse<ProfileCompleteness>> {
    try {
      const isComplete = await this.checkProfileComplete(userId, userType);

      return {
        success: true,
        data: {
          isComplete,
          userType,
        },
      };
    } catch (error) {
      console.error("Profile completeness check error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "프로필 완성도 확인 중 오류가 발생했습니다",
      };
    }
  }

  /**
   * Generate redirect URL based on profile completeness and user type
   */
  static generateRedirectUrl(
    isProfileComplete: boolean,
    userType: string,
    socialData?: { email: string; name: string; realName?: string; phone?: string; birthDate?: string; profileImage?: string }
  ): string {
    if (isProfileComplete) {
      // Redirect to dashboard
      const dashboardMap = {
        hospital: "/dashboard/hospital",
        "veterinary-student": "/dashboard/veterinarian",
        veterinarian: "/dashboard/veterinarian",
      };
      return (
        dashboardMap[userType as keyof typeof dashboardMap] ||
        "/dashboard/veterinarian"
      );
    } else {
      // Redirect to social registration completion form
      const socialRegisterMap = {
        hospital: "/register/social-complete/hospital",
        "veterinary-student": "/register/social-complete/veterinary-student",
        veterinarian: "/register/social-complete/veterinarian",
      };

      const baseUrl =
        socialRegisterMap[userType as keyof typeof socialRegisterMap] ||
        "/register/social-complete/veterinarian";

      if (socialData) {
        const params = new URLSearchParams({
          email: socialData.email,
          name: socialData.name,
          ...(socialData.realName && {
            realName: socialData.realName,
          }),
          ...(socialData.phone && {
            phone: socialData.phone,
          }),
          ...(socialData.birthDate && {
            birthDate: socialData.birthDate,
          }),
          ...(socialData.profileImage && {
            profileImage: socialData.profileImage,
          }),
        });
        return `${baseUrl}?${params.toString()}`;
      }

      return baseUrl;
    }
  }

  /**
   * Traditional login (for Server Actions)
   */
  async login(
    email: string,
    password: string,
    userType: string
  ): Promise<AuthResponse> {
    try {
      // This would implement traditional email/password login
      // For now, returning a placeholder
      return {
        success: true,
        message: "로그인 성공",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "로그인 실패",
      };
    }
  }

  /**
   * Traditional registration (for Server Actions)
   */
  async register(data: any): Promise<AuthResponse> {
    try {
      // This would implement traditional registration
      // For now, returning a placeholder
      return {
        success: true,
        data: { user: data },
        message: "회원가입 성공",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "회원가입 실패",
      };
    }
  }
}
