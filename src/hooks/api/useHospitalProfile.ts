import { useQuery } from '@tanstack/react-query';
import { getHospitalProfile, type HospitalProfile } from '@/actions/auth';

// React Query 키 상수
export const hospitalProfileKeys = {
  profile: ['hospitalProfile'] as const,
};

// 병원 프로필 조회 훅
export function useHospitalProfile() {
  return useQuery({
    queryKey: hospitalProfileKeys.profile,
    queryFn: async (): Promise<HospitalProfile | null> => {
      const result = await getHospitalProfile();
      if (result.success && result.profile) {
        return result.profile;
      }
      // 에러가 있어도 null을 반환하여 UI에서 fallback 처리
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    retry: false, // 인증 실패나 권한 에러 시 재시도하지 않음
  });
}