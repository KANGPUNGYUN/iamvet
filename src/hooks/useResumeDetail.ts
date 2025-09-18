"use client";

import { useEffect, useState } from "react";
import { getResumeByIdAction } from "@/actions/resumes";

interface ResumeDetail {
  id: string;
  userId: string;
  name: string;
  photo?: string;
  introduction?: string;
  selfIntroduction?: string;
  position?: string;
  specialties?: string[];
  preferredRegions?: string[];
  expectedSalary?: string;
  workTypes?: string[];
  startDate?: string;
  preferredWeekdays?: string[];
  weekdaysNegotiable: boolean;
  workStartTime?: string;
  workEndTime?: string;
  workTimeNegotiable: boolean;
  phone?: string;
  email?: string;
  phonePublic: boolean;
  emailPublic: boolean;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export function useResumeDetail(id: string) {
  const [data, setData] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumeDetail() {
      try {
        console.log("[useResumeDetail] 이력서 상세 조회 시작");
        setIsLoading(true);
        const result = await getResumeByIdAction(id);
        console.log("[useResumeDetail] 받은 데이터:", result);
        setData(result as ResumeDetail);
      } catch (err) {
        console.error("[useResumeDetail] 에러 발생:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch resume detail");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchResumeDetail();
    }
  }, [id]);

  return { data, isLoading, error };
}