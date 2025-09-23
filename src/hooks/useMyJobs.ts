import { useState, useEffect } from 'react';

interface Job {
  id: string;
  title: string;
  content: string;
  employmentType: string;
  experience: string;
  education: string;
  salary: string;
  workDays: string;
  workHours: string;
  location: string;
  address: string;
  detailAddress: string | null;
  benefits: string[];
  requiredDocuments: string[];
  specialties: string[];
  preferredConditions: string[];
  deadline: string;
  viewCount: number;
  isActive: boolean;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  hospitalId: string;
  isLiked?: boolean;
  hospital?: {
    id: string;
    name: string;
    profileImage: string | null;
    phone: string;
    location: string;
    address: string;
  };
}

interface MyJobsResponse {
  status: string;
  message: string;
  data: {
    jobs: Job[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export function useMyJobs(limit?: number) {
  const [data, setData] = useState<MyJobsResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // URL 쿼리 파라미터 생성
        const queryParams = new URLSearchParams();
        queryParams.append('myJobs', 'true'); // 내 채용공고만 조회
        if (limit) queryParams.append('limit', limit.toString());
        queryParams.append('sort', 'latest'); // 최신순 정렬

        const queryString = queryParams.toString();
        const url = `/api/jobs${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch my jobs');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyJobs();
  }, [limit]);

  return {
    data,
    error,
    isLoading,
    refetch: () => {
      // 데이터 새로고침 함수 제공
      setIsLoading(true);
      setError(null);
      
      const fetchMyJobs = async () => {
        try {
          const queryParams = new URLSearchParams();
          queryParams.append('myJobs', 'true');
          if (limit) queryParams.append('limit', limit.toString());
          queryParams.append('sort', 'latest');

          const queryString = queryParams.toString();
          const url = `/api/jobs${queryString ? `?${queryString}` : ''}`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch my jobs');
          }

          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setIsLoading(false);
        }
      };

      fetchMyJobs();
    }
  };
}