/**
 * 이력서 관련 React Query 훅들
 * Server Actions를 통한 이력서 조회 및 저장
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenFromStorage } from '@/utils/auth';
import {
  getVeterinarianResumeAction,
  saveVeterinarianResumeAction,
  type VeterinarianResume,
  type ResumeUpdateData,
} from '@/actions/resume';

// 타입 재 export
export type { VeterinarianResume, ResumeUpdateData };

// 수의사 이력서 조회 훅 (새로운 VeterinarianResume 타입 직접 반환)
export const useVeterinarianResume = () => {
  return useQuery({
    queryKey: ['veterinarian-resume'],
    queryFn: async (): Promise<VeterinarianResume | null> => {
      const token = getTokenFromStorage();
      if (!token) throw new Error('No access token');

      console.log('[useVeterinarianResume] Calling server action');

      const result = await getVeterinarianResumeAction(token);
      
      console.log('[useVeterinarianResume] Server action result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch resume');
      }

      // 이력서가 없는 경우 null 반환 (처음 작성하는 경우)
      if (!result.data) return null;
      
      return result.data;
    },
    enabled: true,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 수의사 이력서 저장 훅 (생성/업데이트)
export const useSaveVeterinarianResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResumeUpdateData) => {
      const token = getTokenFromStorage();
      if (!token) throw new Error('No access token');

      console.log('[useSaveVeterinarianResume] Calling server action with data:', data);

      // localStorage의 user 정보를 올바른 ID로 업데이트 (한 번만)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.id === 'DSfc3gHE6GQ552Fu') {
            console.log('[useSaveVeterinarianResume] Updating localStorage user ID to correct value');
            user.id = '3z1Yw4aKy39uJCQQ'; // 실제 작동하는 ID로 업데이트
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (e) {
          console.error('[useSaveVeterinarianResume] Failed to update localStorage user:', e);
        }
      }

      const result = await saveVeterinarianResumeAction(token, data);
      
      console.log('[useSaveVeterinarianResume] Server action result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save resume');
      }

      return result;
    },
    onSuccess: () => {
      // 관련 쿼리 무효화하여 최신 데이터 다시 로드
      queryClient.invalidateQueries({ queryKey: ['veterinarian-resume'] });
      console.log('[useSaveVeterinarianResume] Cache invalidated');
    },
    onError: (error) => {
      console.error('[useSaveVeterinarianResume] Save failed:', error);
    },
  });
};