import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createJob, saveDraftJob, getJobsByHospital } from '@/actions/jobs';
import { CreateJobRequest } from '@/types/job';

// Types for job filtering
export interface JobFilters {
  keyword?: string;
  workType?: string[];
  experience?: string[];
  region?: string;
  major?: string[];
  page?: number;
  limit?: number;
  sort?: 'recent' | 'deadline' | 'popular';
}

export interface JobsResponse {
  jobs: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: JobFilters) => [...jobKeys.lists(), filters] as const,
  myJobs: ['jobs', 'myJobs'] as const,
  job: (id: string) => ['jobs', 'job', id] as const,
};

// Fetch jobs with filters
async function fetchJobsWithFilters(filters: JobFilters): Promise<JobsResponse> {
  const params = new URLSearchParams();

  if (filters.keyword) params.set('keyword', filters.keyword);
  if (filters.workType && filters.workType.length > 0) {
    params.set('workType', filters.workType.join(','));
  }
  if (filters.experience && filters.experience.length > 0) {
    params.set('experience', filters.experience.join(','));
  }
  if (filters.region) params.set('region', filters.region);
  if (filters.major && filters.major.length > 0) {
    params.set('major', filters.major.join(','));
  }
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.sort) params.set('sort', filters.sort);

  const url = `/api/jobs?${params.toString()}`;
  console.log('[useJobs] Fetching from:', url);

  const response = await fetch(url);
  
  console.log('[useJobs] Response status:', response.status);
  console.log('[useJobs] Response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[useJobs] Response error:', errorText);
    throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('[useJobs] Response data:', data);
  
  // Check for both 'success' and 'status' fields for compatibility
  const isSuccess = data.success === true || data.status === 'success';
  
  if (!isSuccess) {
    console.error('[useJobs] API error:', data.message);
    throw new Error(data.message || 'Failed to fetch jobs');
  }

  console.log('[useJobs] Jobs fetched successfully:', data.data.jobs.length);
  return data.data;
}

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => fetchJobsWithFilters(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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