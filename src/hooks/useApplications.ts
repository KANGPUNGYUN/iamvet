"use client";

import { useState, useEffect } from "react";

import { ApplicationStatus } from "@/constants/applicationStatus";

interface ApplicationData {
  id: number;
  applicationDate: string;
  applicant: string;
  position: string;
  contact: string;
  status: ApplicationStatus;
  profileImage?: string;
  jobId: string;
  applicationId: string;
}

export function useApplications(limit: number = 3) {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/applications?limit=${limit}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [limit]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
}