import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDetailedHospitalProfile, 
  saveDetailedHospitalProfile, 
  type DetailedHospitalProfile, 
  type DetailedHospitalProfileData 
} from '@/actions/auth';

// React Query 키 상수
export const detailedHospitalProfileKeys = {
  profile: ['detailedHospitalProfile'] as const,
};

// 상세 병원 프로필 조회 훅
export function useDetailedHospitalProfile() {
  return useQuery({
    queryKey: detailedHospitalProfileKeys.profile,
    queryFn: async (): Promise<DetailedHospitalProfile | null> => {
      const result = await getDetailedHospitalProfile();
      if (result.success && result.profile) {
        return result.profile;
      }
      // 프로필이 없어도 에러가 아님 (처음 작성하는 경우)
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    retry: (failureCount, error) => {
      // 프로필이 없는 경우는 재시도하지 않음
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

// 상세 병원 프로필 저장/업데이트 훅
export function useSaveDetailedHospitalProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DetailedHospitalProfileData) => {
      const result = await saveDetailedHospitalProfile(data);
      if (!result.success) {
        throw new Error(result.error || '병원 프로필 저장에 실패했습니다.');
      }
      return result;
    },
    onSuccess: () => {
      // 프로필 저장 성공 시 캐시 무효화하여 최신 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: detailedHospitalProfileKeys.profile });
    },
    onError: (error) => {
      console.error('Hospital profile save error:', error);
    },
  });
}

// 병원 프로필 존재 여부 확인 훅
export function useHasDetailedHospitalProfile() {
  const { data: profile, isLoading, error } = useDetailedHospitalProfile();
  
  return {
    hasProfile: !!profile,
    isLoading,
    error,
    profileId: profile?.id,
  };
}