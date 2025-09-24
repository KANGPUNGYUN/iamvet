import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: () => fetch('/api/resumes').then(res => res.json()),
  });
}

export function useResumeEvaluations(resumeId: string) {
  return useQuery({
    queryKey: ['resume-evaluations', resumeId],
    queryFn: async () => {
      const response = await axios.get(`/api/resumes/${resumeId}/evaluation`);
      return response.data;
    },
    enabled: !!resumeId,
  });
}

export function useCreateResumeEvaluation(resumeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (evaluationData: any) => {
      const response = await axios.post(`/api/resumes/${resumeId}/evaluation`, evaluationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-evaluations', resumeId] });
    },
  });
}

export function useUpdateResumeEvaluation(resumeId: string, evaluationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (evaluationData: any) => {
      const response = await axios.put(`/api/resumes/${resumeId}/evaluation/${evaluationId}`, evaluationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-evaluations', resumeId] });
    },
  });
}

export function useDeleteResumeEvaluation(resumeId: string, evaluationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/resumes/${resumeId}/evaluation/${evaluationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-evaluations', resumeId] });
    },
  });
}