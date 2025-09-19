import { useQuery } from '@tanstack/react-query';

interface VeterinarianApplication {
  id: number;
  jobId: string;
  applicationDate: string;
  hospitalName: string;
  hospitalContact: string;
  jobPosition: string;
  status: "서류 대기" | "서류 합격" | "면접 대기" | "불합격" | "최종합격";
  hospitalLogo?: string;
}

interface VeterinarianApplicationsResponse {
  applications: VeterinarianApplication[];
}

const fetchVeterinarianApplications = async (sort: string = 'latest'): Promise<VeterinarianApplicationsResponse> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`/api/dashboard/veterinarian/applications?sort=${sort}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('지원내역을 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.data;
};

export const useVeterinarianApplications = (sort: string = 'latest') => {
  return useQuery({
    queryKey: ['veterinarian-applications', sort],
    queryFn: () => fetchVeterinarianApplications(sort),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (React Query v5에서 cacheTime이 gcTime으로 변경됨)
  });
};

export type { VeterinarianApplication, VeterinarianApplicationsResponse };