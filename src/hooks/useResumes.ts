"use client";

import { useEffect, useState } from "react";
import { getResumesAction } from "@/actions/resumes";

interface Resume {
  id: string;
  name: string;
  photo?: string;
  introduction?: string;
  selfIntroduction?: string;
  specialties?: string[];
  position?: string;
  preferredRegions?: string[];
  createdAt: string;
  updatedAt: string;
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
        const result = await getResumesAction(params);
        console.log("[useResumes] 받은 데이터:", result);
        setData(result);
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