// src/hooks/api/useAdminResumes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  experience: number;
  location: string;
  education: string;
  specialties: string[];
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  verified: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  lastUpdated: string;
  profileImage?: string;
  userId: string;
  // 상세 정보 (상세 조회시에만 포함)
  description?: string;
  careerHistory?: Array<{
    hospitalName: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  certificates?: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }>;
  achievements?: string[];
  skills?: string[];
  languages?: string[];
  portfolio?: Array<{
    title: string;
    description: string;
    url?: string;
    images?: string[];
  }>;
}

interface ResumesFilters {
  search?: string;
  status?: string;
  specialty?: string;
  location?: string;
  experience?: string;
  verified?: string;
  page?: number;
  limit?: number;
}

interface ResumesResponse {
  resumes: Resume[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    pending: number;
    verified: number;
    unverified: number;
  };
}

interface ResumeDetailResponse {
  resume: Resume & {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      joinDate: string;
      lastLogin?: string;
      verified: boolean;
      veterinarianLicense?: {
        licenseNumber: string;
        licenseImage: string;
        issueDate: string;
        expiryDate: string;
      };
    };
  };
  recentApplications?: Array<{
    id: string;
    jobTitle: string;
    hospitalName: string;
    appliedAt: string;
    status: string;
  }>;
  recentViews?: Array<{
    hospitalName: string;
    viewedAt: string;
  }>;
}

// 관리자 토큰 가져오기 함수
const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  
  // 로컬 스토리지에서 관리자 토큰 확인
  const token = localStorage.getItem('admin-token') || localStorage.getItem('accessToken');
  
  // 임시 테스트용 토큰 (실제 운영에서는 제거해야 함)
  if (!token) {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiYWRtaW5fdGVzdCIsImVtYWlsIjoiYWRtaW5AaWFtdmV0LmNvLmtyIiwibmFtZSI6IuyLnOyKpO2FnCDqtIDrpqzsnpAiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3NTkwODkxMzIsImV4cCI6MTc1OTExNzkzMn0.uR5muHTx8jMajwGNrCs6fzaBdSLE29HBTVTuztogi64";
  }
  
  return token;
};

// API 요청 헤더 설정
const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// 이력서 목록 조회
export const useAdminResumes = (filters: ResumesFilters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.specialty) queryParams.append('specialty', filters.specialty);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.experience) queryParams.append('experience', filters.experience);
  if (filters.verified) queryParams.append('verified', filters.verified);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  return useQuery<ResumesResponse>({
    queryKey: ['admin-resumes', filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/resumes?${queryParams}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('이력서 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '이력서 목록 조회 실패');
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
};

// 이력서 상세 정보 조회
export const useAdminResumeDetail = (resumeId: string) => {
  return useQuery<ResumeDetailResponse>({
    queryKey: ['admin-resume', resumeId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/resumes/${resumeId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('이력서 정보를 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '이력서 정보 조회 실패');
      }

      return data.data;
    },
    enabled: !!resumeId,
    staleTime: 5 * 60 * 1000,
  });
};

// 이력서 액션 수행 (승인, 정지, 삭제 등)
export const useAdminResumeAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      resumeId, 
      action, 
      reason 
    }: { 
      resumeId: string; 
      action: 'approve' | 'suspend' | 'activate' | 'delete' | 'verify'; 
      reason?: string;
    }) => {
      const response = await fetch(`/api/admin/resumes/${resumeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action, reason }),
      });

      if (!response.ok) {
        throw new Error('작업을 수행하는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '작업 수행 실패');
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // 이력서 목록과 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['admin-resumes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-resume', variables.resumeId] });
    },
  });
};

// 이력서 통계 조회
export const useAdminResumesStats = () => {
  return useQuery({
    queryKey: ['admin-resumes-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/resumes?limit=1', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('통계 정보를 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '통계 조회 실패');
      }

      return data.data.stats;
    },
    staleTime: 10 * 60 * 1000, // 10분
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 갱신
  });
};

export type { Resume, ResumesFilters, ResumesResponse, ResumeDetailResponse };