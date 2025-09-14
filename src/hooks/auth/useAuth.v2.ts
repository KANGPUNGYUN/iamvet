/**
 * Modern Auth Hooks using Hook Factory Pattern
 *
 * Following PROJECT_ARCHITECTURE.md:
 * - Server Actions for form processing
 * - API Routes for OAuth
 * - Centralized service layer
 */

import {
  createServerActionHook,
  createSocialLoginHook,
  authQueryKeys,
} from "@/lib/hook-factory";
import {
  login,
  registerVeterinarian,
  registerVeterinaryStudent,
} from "@/actions/auth";
import { LoginRequest, AuthResponse, SocialLoginResponse } from "@/types/auth";
import { useRouter } from "next/navigation";

// Server Action Hooks (for form processing)
export const useLogin = createServerActionHook(
  async (data: LoginRequest) => {
    return await login({
      email: data.email,
      password: data.password,
      userType: data.userType,
    });
  },
  {
    onSuccess: (data) => {
      if (data.success) {
        // Handle successful login
        console.log("Login successful:", data);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  }
);

export const useVeterinarianRegister = createServerActionHook(
  async (data: any) => {
    return await registerVeterinarian(data);
  },
  {
    onSuccess: (data) => {
      if (data.success) {
        console.log("Veterinarian registration successful:", data);
      }
    },
    onError: (error) => {
      console.error("Veterinarian registration failed:", error);
    },
  }
);

export const useVeterinaryStudentRegister = createServerActionHook(
  async (data: any) => {
    return await registerVeterinaryStudent(data);
  },
  {
    onSuccess: (data) => {
      if (data.success) {
        console.log("Veterinary student registration successful:", data);
      }
    },
    onError: (error) => {
      console.error("Veterinary student registration failed:", error);
    },
  }
);

// Social Login Hooks (for OAuth API Routes)
export const useGoogleLogin = createSocialLoginHook("google");
export const useKakaoLogin = createSocialLoginHook("kakao");
export const useNaverLogin = createSocialLoginHook("naver");

// Unified Social Login Hook
export function useSocialLogin() {
  const router = useRouter();
  const googleLogin = useGoogleLogin;
  const kakaoLogin = useKakaoLogin;
  const naverLogin = useNaverLogin;

  const handleSocialLogin = (
    provider: "google" | "kakao" | "naver",
    userType: "veterinarian" | "hospital" | "veterinary-student"
  ) => {
    const loginHook = {
      google: googleLogin,
      kakao: kakaoLogin,
      naver: naverLogin,
    }[provider];

    const { initiateLogin } = loginHook(userType);

    initiateLogin(
      (data: SocialLoginResponse) => {
        // Handle successful social login
        if (!data.isProfileComplete && data.user) {
          // Redirect to registration with social data
          const registerPath = {
            hospital: "/register/social-complete/hospital",
            "veterinary-student":
              "/register/social-complete/veterinary-student",
            veterinarian: "/register/social-complete/veterinarian",
          }[userType];

          const params = new URLSearchParams({
            email: data.user.email,
            name: data.user.name,
            ...(data.user.profileImage && {
              profileImage: data.user.profileImage,
            }),
          });

          router.push(`${registerPath}?${params.toString()}`);
        } else {
          // Redirect to dashboard
          const dashboardPath = {
            hospital: "/dashboard/hospital",
            "veterinary-student": "/dashboard/veterinarian",
            veterinarian: "/dashboard/veterinarian",
          }[userType];

          router.push(dashboardPath);
        }
      },
      (error: string) => {
        // Handle error
        console.error("Social login failed:", error);
      }
    );
  };

  return { handleSocialLogin };
}

// Query Keys Export
export { authQueryKeys };
