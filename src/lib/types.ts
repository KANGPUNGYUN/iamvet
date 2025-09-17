// lib/types.ts
// API 관련 타입 정의

// 기본 API 응답 타입
export interface BaseResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ApiResponse<T = any> extends BaseResponse {
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error?: string;
  errorCode?: string;
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface VeterinarianLoginRequest {
  username: string;
  password: string;
  loginType: "normal" | "naver" | "kakao" | "google";
}

export interface HospitalLoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    nickname: string;
    email: string;
    profileImage?: string;
    userType: "veterinarian" | "hospital";
    provider: "normal" | "naver" | "kakao" | "google";
    socialAccounts: any[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  isNewUser: boolean;
}

// 수의사 회원가입 요청 타입 (업데이트됨)
export interface VeterinarianSignupRequest {
  // 공통 필수 필드
  email: string;
  phone: string;
  realName: string;
  
  // 인증 정보 (SNS 로그인 시 제외)
  loginId?: string;
  password?: string;
  
  // 수의사 필수 필드
  nickname: string;
  birthDate: Date;
  licenseImage: File;
  
  // 선택 필드
  profileImage?: File;
  
  // 약관 동의 (필수)
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

// 수의학과 학생 회원가입 요청 타입 (업데이트됨)
export interface VeterinaryStudentSignupRequest {
  // 공통 필수 필드
  email: string;
  phone: string;
  realName: string;
  
  // 인증 정보 (SNS 로그인 시 제외)
  loginId?: string;
  password?: string;
  
  // 학생 필수 필드
  nickname: string;
  birthDate: Date;
  universityEmail: string;
  
  // 선택 필드
  profileImage?: File;
  licenseImage?: File; // 학생은 선택사항
  
  // 약관 동의 (필수)
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

// 병원 회원가입 요청 타입 (업데이트됨)
export interface HospitalSignupRequest {
  // 공통 필수 필드
  email: string;
  phone: string;
  realName: string; // 병원 대표자명
  
  // 인증 정보
  loginId: string;
  password: string;
  
  // 병원 필수 필드
  hospitalName: string;
  establishedDate: Date;
  businessNumber: string;
  hospitalAddress: string;
  treatmentAnimals: ('DOG' | 'CAT' | 'EXOTIC' | 'LARGE_ANIMAL')[];
  treatmentSpecialties: ('INTERNAL_MEDICINE' | 'SURGERY' | 'DERMATOLOGY' | 'DENTISTRY' | 'OPHTHALMOLOGY' | 'NEUROLOGY' | 'ORTHOPEDICS')[];
  businessLicenseFile: File;
  
  // 선택 필드
  hospitalWebsite?: string;
  hospitalLogo?: File;
  hospitalAddressDetail?: string;
  hospitalFacilityImages?: File[]; // 최대 10장
  
  // 약관 동의 (필수)
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

// 기존 호환성을 위한 타입 (deprecated)
export interface VeterinarianRegisterRequest {
  username: string;
  password?: string;
  nickname: string;
  phone: string;
  email: string;
  birthDate?: string;
  profileImage?: File;
  licenseImage: File;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export interface HospitalRegisterRequest {
  username: string;
  password: string;
  hospitalName: string;
  businessNumber: string;
  phone: string;
  email: string;
  address: string;
  detailAddress?: string;
  website?: string;
  treatableAnimals: string[];
  medicalFields: string[];
  logoImage?: File;
  facilityImages?: File[];
  businessRegistration?: File;
  foundedDate?: string;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

// 채용공고 관련 타입
export interface JobPostingCreateRequest {
  title: string;
  description: string;
  workType: string;
  position: string;
  salary?: string;
  deadline?: string;
  isDeadlineUnlimited?: boolean;
  recruitCount?: number;
  isDraft?: boolean;
  isPublic?: boolean;
}

export interface JobDetail {
  id: string;
  title: string;
  description: string;
  workType: string;
  position: string;
  salary?: string;
  deadline?: string;
  isDeadlineUnlimited: boolean;
  recruitCount: number;
  isDraft: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  hospital: {
    id: string;
    hospitalName: string;
    address: string;
    logoImage?: string;
  };
}

// 쿼리 파라미터 타입
export interface JobsQueryParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: "latest" | "oldest" | "deadline";
  workType?: string;
  experience?: string;
  region?: string;
}

export interface ResumesQueryParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: "latest" | "oldest";
  workType?: string;
  experience?: string;
  region?: string;
  license?: string;
}

export interface LecturesQueryParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: "latest" | "oldest";
  medicalField?: string;
  animal?: string;
  difficulty?: string;
}

// 댓글 관련 타입
export interface CommentCreateRequest {
  content: string;
  parentCommentId?: string;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface CommentResponse {
  commentId: string;
  lectureId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    nickname: string;
    profileImage?: string;
  };
  repliesCount: number;
  likesCount: number;
}

export interface CommentsListResponse {
  comments: CommentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 비밀번호 변경 타입
export interface PasswordChangeRequest {
  currentPassword?: string;
  newPassword: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 업로드 관련 타입
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// 사용자 프로필 타입
export interface User {
  id: string;
  username: string;
  email: string;
  userType: "veterinarian" | "hospital";
  profileImage?: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface VeterinarianProfile extends User {
  nickname?: string;
  birthDate?: string;
  licenseImage?: string;
  realName: string;
}

export interface HospitalProfile extends User {
  hospitalName: string;
  businessNumber: string;
  address: string;
  detailAddress?: string;
  website?: string;
  logoImage?: string;
  facilityImages: string[];
  treatableAnimals: string[];
  medicalFields: string[];
  businessRegistration?: string;
  foundedDate?: string;
}

// 기타 유틸리티 타입
export type UserType = "veterinarian" | "hospital" | "veterinary_student";
export type LoginType = "normal" | "naver" | "kakao" | "google";
export type SortOrder = "latest" | "oldest" | "deadline";

// 동물 타입
export type AnimalType = 'DOG' | 'CAT' | 'EXOTIC' | 'LARGE_ANIMAL';

// 진료 분야 타입
export type SpecialtyType = 'INTERNAL_MEDICINE' | 'SURGERY' | 'DERMATOLOGY' | 'DENTISTRY' | 'OPHTHALMOLOGY' | 'NEUROLOGY' | 'ORTHOPEDICS';

// 파일 검증 타입
export interface FileValidation {
  maxSize: number; // bytes
  allowedTypes: string[];
  maxCount?: number;
}

// 회원가입 검증 설정
export const SIGNUP_VALIDATION = {
  profileImage: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg']
  },
  licenseImage: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  },
  hospitalLogo: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg']
  },
  facilityImages: {
    maxSize: 5 * 1024 * 1024, // 5MB per image
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    maxCount: 10
  },
  businessLicense: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
} as const;

// API 응답 생성 함수들
export function createApiResponse(status: string, message: string, data?: any) {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

export function createErrorResponse(message: string, data?: any) {
  return {
    status: "error",
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

// 이메일 검증 함수
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}