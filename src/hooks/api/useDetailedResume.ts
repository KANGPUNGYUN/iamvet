import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDetailedResume, 
  saveDetailedResume, 
  type DetailedResume, 
  type DetailedResumeData 
} from '@/actions/auth';

// React Query 키 상수
export const detailedResumeKeys = {
  resume: ['detailedResume'] as const,
};

// 상세 이력서 조회 훅
export function useDetailedResume() {
  return useQuery({
    queryKey: detailedResumeKeys.resume,
    queryFn: async (): Promise<DetailedResume | null> => {
      const result = await getDetailedResume();
      if (result.success && result.resume) {
        return result.resume;
      }
      // 이력서가 없어도 에러가 아님 (처음 작성하는 경우)
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    retry: (failureCount, error) => {
      // 이력서가 없는 경우는 재시도하지 않음
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = error.message as string;
        if (errorMessage.includes('찾을 수 없습니다')) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
}

// 상세 이력서 저장/업데이트 훅
export function useSaveDetailedResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DetailedResumeData) => {
      const result = await saveDetailedResume(data);
      if (!result.success) {
        throw new Error(result.error || '이력서 저장에 실패했습니다.');
      }
      return result;
    },
    onSuccess: () => {
      // 이력서 저장 성공 시 캐시 무효화하여 최신 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: detailedResumeKeys.resume });
    },
    onError: (error) => {
      console.error('Resume save error:', error);
    },
  });
}

// 이력서 존재 여부 확인 훅
export function useHasDetailedResume() {
  const { data: resume, isLoading, error } = useDetailedResume();
  
  return {
    hasResume: !!resume,
    isLoading,
    error,
    resumeId: resume?.id,
  };
}