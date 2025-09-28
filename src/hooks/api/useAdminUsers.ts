// src/hooks/api/useAdminUsers.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  userType: "VETERINARIAN" | "HOSPITAL" | "VETERINARY_STUDENT";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  isActive: boolean;
  verified: boolean;
  joinDate: string;
  lastLogin: string;
  phone?: string;
  address?: string;
  // 수의사 관련 필드
  veterinarianLicense?: {
    licenseNumber: string;
    licenseImage: string;
    issueDate: string;
    expiryDate: string;
  };
  // 병원 관련 필드
  hospitalInfo?: {
    businessNumber: string;
    businessRegistration: string;
    representativeName: string;
    establishedDate: string;
  };
}

interface UsersFilters {
  search?: string;
  userType?: string;
  status?: string;
  verified?: string;
  page?: number;
  limit?: number;
}

interface UsersResponse {
  users: User[];
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
    veterinarians: number;
    hospitals: number;
    students: number;
  };
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

// 사용자 목록 조회
export const useAdminUsers = (filters: UsersFilters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.userType) queryParams.append('userType', filters.userType);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.verified) queryParams.append('verified', filters.verified);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  return useQuery<UsersResponse>({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users?${queryParams}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('사용자 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '사용자 목록 조회 실패');
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
};

// 사용자 상세 정보 조회
export const useAdminUserDetail = (userId: string) => {
  return useQuery<{ user: User }>({
    queryKey: ['admin-user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '사용자 정보 조회 실패');
      }

      return data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// 사용자 인증 정보 조회
export const useAdminUserVerification = (userId: string) => {
  return useQuery({
    queryKey: ['admin-user-verification', userId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('인증 정보를 불러오는데 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '인증 정보 조회 실패');
      }

      return data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// 사용자 액션 수행 (인증, 정지 등)
export const useAdminUserAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      action, 
      reason 
    }: { 
      userId: string; 
      action: 'verify' | 'reject' | 'suspend' | 'delete' | 'activate'; 
      reason?: string;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
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
      // 사용자 목록과 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-verification', variables.userId] });
    },
  });
};

// 사용자 인증 처리 (별도 엔드포인트)
export const useAdminUserVerify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      action, 
      reason 
    }: { 
      userId: string; 
      action: 'approve' | 'reject'; 
      reason?: string;
    }) => {
      console.log('useAdminUserVerify mutation called with:', { userId, action, reason });
      
      const url = `/api/admin/users/${userId}/verify`;
      const headers = getAuthHeaders();
      const body = JSON.stringify({ action, reason });
      
      console.log('Making request to:', url);
      console.log('Headers:', headers);
      console.log('Body:', body);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`인증 처리에 실패했습니다: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.status !== 'success') {
        throw new Error(data.message || '인증 처리 실패');
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-verification', variables.userId] });
    },
  });
};

// 사용자 정보 업데이트
export const useAdminUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      updateData 
    }: { 
      userId: string; 
      updateData: Partial<User>;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('사용자 정보 업데이트에 실패했습니다');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || '정보 업데이트 실패');
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.userId] });
    },
  });
};

// 사용자 통계 조회
export const useAdminUsersStats = () => {
  return useQuery({
    queryKey: ['admin-users-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users?limit=1', {
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