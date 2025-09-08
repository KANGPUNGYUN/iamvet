import { useQuery } from '@tanstack/react-query';
import { getVeterinarianProfile, type VeterinarianProfile } from '@/actions/auth';

// React Query 키 상수
export const veterinarianProfileKeys = {
  profile: ['veterinarianProfile'] as const,
};

// 수의사 프로필 조회 훅
export function useVeterinarianProfile() {
  return useQuery({
    queryKey: veterinarianProfileKeys.profile,
    queryFn: async (): Promise<VeterinarianProfile | null> => {
      const result = await getVeterinarianProfile();
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