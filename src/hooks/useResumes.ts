"use client";

import { useEffect, useState } from "react";

interface Resume {
  id: string;
  userId: string;
  name: string;
  photo?: string;
  introduction?: string;
  selfIntroduction?: string;
  specialties?: string[];
  position?: string;
  preferredRegions?: string[];
  expectedSalary?: string;
  workTypes?: string[];
  startDate?: string;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
}

interface ResumesData {
  data: Resume[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export function useResumes(params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const [data, setData] = useState<ResumesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumes() {
      try {
        console.log("[useResumes] 이력서 데이터 조회 시작");
        setIsLoading(true);
        
        // API 라우트를 직접 호출하여 좋아요 정보를 포함한 데이터 가져오기
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        
        const url = `/api/resumes?${queryParams.toString()}`;
        console.log("[useResumes] 요청 URL:", url);
        
        const response = await fetch(url);
        console.log("[useResumes] 응답 상태:", response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch resumes: ${response.status} ${response.statusText}`);
        }
        
        const apiResult = await response.json();
        console.log("[useResumes] API 응답:", apiResult);
        
        // API 응답에서 실제 resumes 데이터 추출
        const resumesData = apiResult.data?.resumes;
        console.log("[useResumes] 받은 데이터:", resumesData);
        setData(resumesData);
      } catch (err) {
        console.error("[useResumes] 에러 발생:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch resumes");
      } finally {
        setIsLoading(false);
      }
    }

    fetchResumes();
  }, [params?.page, params?.limit, params?.sort]);

  return { data, isLoading, error };
}