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

// 회원가입 관련 타입
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
  nickname: string;
  birthDate?: string;
  licenseImage: string;
  experience?: string;
  specializations?: string[];
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
export type UserType = "veterinarian" | "hospital";
export type LoginType = "normal" | "naver" | "kakao" | "google";
export type SortOrder = "latest" | "oldest" | "deadline";

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