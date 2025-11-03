/**
 * 이력서 상태 실시간 확인 Hook
 * 지원하기 전 이력서 존재 여부 및 완성도 확인
 */

import { useQuery } from '@tanstack/react-query';
import { getTokenFromStorage } from '@/utils/auth';

interface ResumeInfo {
  id: string;
  name: string;
  updatedAt: string;
  isComplete: boolean;
}

interface ResumeStatusResponse {
  status: string;
  message: string;
  data: {
    hasResume: boolean;
    resume: ResumeInfo | null;
    requiresResume: boolean;
    message: string;
  };
}

// 이력서 상태 확인 함수
const fetchResumeStatus = async (): Promise<ResumeStatusResponse> => {
  const token = getTokenFromStorage();
  if (!token) {
    throw new Error('No authentication token');
  }

  const response = await fetch('/api/user/resume-status', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 이력서 상태 확인 Hook
export const useResumeStatus = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['resume-status'],
    queryFn: fetchResumeStatus,
    enabled,
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
    retry: 2,
    refetchOnWindowFocus: true, // 창 포커스 시 재확인
    refetchOnMount: true, // 마운트 시 재확인
  });
};

// 이력서 상태 실시간 재확인 (지원하기 버튼 클릭 시 사용)
export const useResumeStatusRefresh = () => {
  const { refetch } = useResumeStatus(false);
  
  return {
    checkResumeStatus: () => refetch(),
  };
};