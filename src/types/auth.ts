export interface LoginRequest {
  email: string;
  password: string;
  userType: 'VETERINARIAN' | 'HOSPITAL' | 'VETERINARY_STUDENT';
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// SNS Login Types
export interface SocialLoginRequest {
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER';
  userType: 'veterinarian' | 'hospital' | 'veterinary-student';
}

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  realName?: string;
  phone?: string;
  birthDate?: string;
  profileImage?: string;
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER';
  providerId: string;
  userType: string;
  nickname?: string;
  socialAccounts?: any[];
}

export interface SocialLoginResponse {
  user: SocialUser | null;
  tokens: {
    accessToken: string;
    refreshToken: string;
  } | null;
  isNewUser: boolean;
  isProfileComplete: boolean;
  socialData?: {
    email: string;
    name: string;
    realName?: string;
    phone?: string;
    birthDate?: string;
    profileImage?: string;
    provider: string;
    providerId: string;
    userType: string;
  };
}

// Registration Form Types
export interface SocialRegistrationData {
  email: string;
  name: string;
  profileImage?: string;
}

export interface VeterinarianSocialRegistration extends SocialRegistrationData {
  // 수의사는 SNS 이메일을 그대로 사용
}

export interface VeterinaryStudentSocialRegistration extends SocialRegistrationData {
  // 수의학과 학생은 별도 대학교 이메일 필요
  universityEmail: string;
}

// Auth Service Response Types
export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Profile Completeness Types
export interface ProfileCompleteness {
  isComplete: boolean;
  missingFields?: string[];
  userType: string;
}