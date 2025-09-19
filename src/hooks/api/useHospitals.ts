import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface HospitalDetailResponse {
  data: {
    id: string;
    name: string;
    summary: string;
    contact: string;
    email: string;
    website: string;
    establishedYear: string;
    address: string;
    detailAddress?: string;
    logo?: string;
    introduction: string;
    businessType: string;
    specialties: string[];
    facilityImages: string[];
    jobPostings: any[];
    jobCount: number;
  };
  message: string;
  status: string;
}

export function useHospitals() {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: () => fetch('/api/hospitals').then(res => res.json()),
  });
}

export function useHospitalDetail(hospitalId: string) {
  return useQuery<HospitalDetailResponse>({
    queryKey: ['hospital', hospitalId],
    queryFn: async () => {
      console.log("[Hook] Fetching hospital with ID:", hospitalId);
      try {
        const response = await fetch(`/api/hospitals/${hospitalId}`);
        console.log("[Hook] Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("[Hook] Response data:", data);
        return data;
      } catch (error) {
        console.error("[Hook] Fetch error:", error);
        throw error;
      }
    },
    enabled: !!hospitalId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
  });
}

export function useHospitalEvaluations(hospitalId: string) {
  return useQuery({
    queryKey: ['hospital-evaluations', hospitalId],
    queryFn: async () => {
      const response = await axios.get(`/api/hospitals/${hospitalId}/evaluation`);
      return response.data;
    },
    enabled: !!hospitalId,
  });
}

export function useCreateHospitalEvaluation(hospitalId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (evaluationData: any) => {
      const response = await axios.post(`/api/hospitals/${hospitalId}/evaluation`, evaluationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospital-evaluations', hospitalId] });
      queryClient.invalidateQueries({ queryKey: ['hospital', hospitalId] });
    },
  });
}