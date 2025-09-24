"use client";

import { useEffect, useState } from "react";

interface RelatedResume {
  id: string;
  name: string;
  experience: string;
  preferredLocation: string;
  keywords: string[];
  lastAccessDate: string;
  isBookmarked: boolean;
}

export function useRelatedResumes(resumeId: string) {
  const [data, setData] = useState<RelatedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelatedResumes() {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/resumes/${resumeId}/related`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiResponse = await response.json();
        
        if (apiResponse.status === 'success' && apiResponse.data) {
          setData(apiResponse.data);
        } else {
          throw new Error(apiResponse.message || 'Failed to fetch related resumes');
        }
      } catch (err) {
        console.error("[useRelatedResumes] 에러 발생:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch related resumes");
      } finally {
        setIsLoading(false);
      }
    }

    if (resumeId) {
      fetchRelatedResumes();
    }
  }, [resumeId]);

  return { data, isLoading, error };
}