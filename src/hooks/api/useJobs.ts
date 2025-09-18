import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createJob, saveDraftJob, getJobsByHospital } from '@/actions/jobs';
import { CreateJobRequest } from '@/types/job';

export const jobKeys = {
  all: ['jobs'] as const,
  myJobs: ['jobs', 'myJobs'] as const,
  job: (id: string) => ['jobs', 'job', id] as const,
};

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetch('/api/jobs').then(res => res.json()),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetch(`/api/jobs/${id}`).then(res => res.json()),
  });
}

export function useMyJobs() {
  return useQuery({
    queryKey: jobKeys.myJobs,
    queryFn: async () => {
      const result = await getJobsByHospital();
      if (!result.success) {
        throw new Error(result.error || '채용공고 조회에 실패했습니다.');
      }
      return result.jobs || [];
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateJobRequest) => {
      const result = await createJob(data);
      if (!result.success) {
        throw new Error(result.error || '채용공고 등록에 실패했습니다.');
      }
      return result.job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs });
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useSaveDraftJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateJobRequest) => {
      const result = await saveDraftJob(data);
      if (!result.success) {
        throw new Error(result.error || '채용공고 임시저장에 실패했습니다.');
      }
      return result.job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs });
    },
  });
}