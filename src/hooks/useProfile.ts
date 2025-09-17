/**
 * 사용자 프로필 관련 React Query 훅들
 * Server Actions를 통한 프로필 조회 및 업데이트
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenFromStorage } from '@/utils/auth';
import {
  getVeterinarianProfileAction,
  updateVeterinarianProfileAction,
  type VeterinarianProfile,
  type ProfileUpdateData,
} from '@/actions/profile';

// 타입 재 export
export type { VeterinarianProfile, ProfileUpdateData };

// 수의사 프로필 조회 훅
export const useVeterinarianProfile = () => {
  return useQuery({
    queryKey: ['veterinarian-profile'],
    queryFn: async (): Promise<VeterinarianProfile> => {
      const token = getTokenFromStorage();
      if (!token) throw new Error('No access token');

      console.log('[useVeterinarianProfile] Calling server action');

      const result = await getVeterinarianProfileAction(token);
      
      console.log('[useVeterinarianProfile] Server action result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch profile');
      }

      if (!result.data) {
        throw new Error('No profile data returned');
      }

      return result.data;
    },
    enabled: true, // 항상 실행하도록 변경
    retry: 3, // 실패 시 3번 재시도
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (cacheTime은 gcTime으로 변경됨)
  });
};

// 수의사 프로필 업데이트 훅
export const useUpdateVeterinarianProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const token = getTokenFromStorage();
      if (!token) throw new Error('No access token');

      console.log('[useUpdateVeterinarianProfile] Calling server action with data:', data);

      const result = await updateVeterinarianProfileAction(token, data);
      
      console.log('[useUpdateVeterinarianProfile] Server action result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      return result;
    },
    onSuccess: () => {
      // 관련 쿼리 무효화하여 최신 데이터 다시 로드
      queryClient.invalidateQueries({ queryKey: ['veterinarian-profile'] });
      console.log('[useUpdateVeterinarianProfile] Cache invalidated');
    },
    onError: (error) => {
      console.error('[useUpdateVeterinarianProfile] Update failed:', error);
    },
  });
};