// src/hooks/api/useAdminJobs.ts
import { useQuery } from '@tanstack/react-query';

interface Job {
  id: string;
  title: string;
  description: string;
  hospitalName: string;
  hospitalId: string;
  hospitalPhone?: string;
  hospitalAddress?: string;
  location: string;
  workType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  salary?: string;
  salaryType?: string;
  requirements?: string;
  benefits?: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";
  isUrgent: boolean;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  applicantCount: number;
  reportCount: number;
  likeCount: number;
}

interface JobsFilters {
  search?: string;
  workType?: string;
  status?: string;
  location?: string;
  page?: number;
  limit?: number;
}

interface JobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    expired: number;
    fullTime: number;
    partTime: number;
    contract: number;
    intern: number;
  };
}

interface JobDetailResponse {
  job: Job & {
    hospital: {
      id: string;
      name: string;
      phone?: string;
      address?: string;
      email?: string;
      businessNumber?: string;
      representativeName?: string;
      establishedDate?: string;
    };
  };
  recentApplicants: Array<{
    id: string;
    createdAt: string;
    status: string;
    coverLetter?: string;
    veterinarian: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      experienceYears?: number;
      specialization?: string;
      licenseNumber?: string;
    };
  }>;
  recentReports: Array<{
    id: string;
    reason: string;
    description?: string;
    status: string;
    createdAt: string;
    reporter: {
      name: string;
      email: string;
    };
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

// 채용 공고 목록 조회
export const useAdminJobs = (filters: JobsFilters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.workType) queryParams.append('workType', filters.workType);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  return useQuery<JobsResponse>({
    queryKey: ['admin-jobs', filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/jobs?${queryParams}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('채용 공고 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '채용 공고 목록 조회 실패');
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
};

// 채용 공고 상세 정보 조회
export const useAdminJobDetail = (jobId: string) => {
  return useQuery<JobDetailResponse>({
    queryKey: ['admin-job', jobId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('채용 공고 정보를 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '채용 공고 정보 조회 실패');
      }

      return data.data;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

// 채용 공고 통계 조회
export const useAdminJobsStats = () => {
  return useQuery({
    queryKey: ['admin-jobs-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/jobs?limit=1', {
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