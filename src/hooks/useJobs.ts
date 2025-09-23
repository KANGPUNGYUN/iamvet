import { useState, useEffect } from 'react';

interface JobFilters {
  keyword?: string;
  employmentType?: string[];
  experience?: string[];
  region?: string[];
  specialty?: string[];
  sort?: 'latest' | 'oldest' | 'deadline' | 'popular';
  page?: number;
  limit?: number;
}

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
  hospital: {
    id: string;
    name: string;
    profileImage: string | null;
    phone: string;
    location: string;
    address: string;
  };
}

interface JobsResponse {
  status: string;
  message: string;
  data: {
    jobs: Job[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export function useJobs(initialFilters?: JobFilters) {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>(initialFilters || {});

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // URL 쿼리 파라미터 생성
        const queryParams = new URLSearchParams();
        
        if (filters.keyword) queryParams.append('keyword', filters.keyword);
        if (filters.employmentType?.length) {
          filters.employmentType.forEach(type => queryParams.append('employmentType', type));
        }
        if (filters.experience?.length) {
          filters.experience.forEach(exp => queryParams.append('experience', exp));
        }
        if (filters.region?.length) {
          filters.region.forEach(region => queryParams.append('region', region));
        }
        if (filters.specialty?.length) {
          filters.specialty.forEach(spec => queryParams.append('specialty', spec));
        }
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());

        const queryString = queryParams.toString();
        const url = `/api/jobs${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  return {
    data,
    error,
    isLoading,
    filters,
    setFilters,
  };
}

export function useJob(id: string) {
  const [data, setData] = useState<Job | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  return {
    data,
    error,
    isLoading,
  };
}