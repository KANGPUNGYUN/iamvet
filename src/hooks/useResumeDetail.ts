"use client";

import { useEffect, useState } from "react";

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
  isLiked?: boolean;
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
        
        const response = await fetch(`/api/resumes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiResponse = await response.json();
        console.log("[useResumeDetail] 받은 데이터:", apiResponse);
        
        if (apiResponse.status === 'success' && apiResponse.data) {
          setData(apiResponse.data as ResumeDetail);
        } else {
          throw new Error(apiResponse.message || 'Failed to fetch resume detail');
        }
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