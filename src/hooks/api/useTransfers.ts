import { useQuery } from '@tanstack/react-query';

interface TransferFilters {
  page?: number;
  limit?: number;
  sort?: string;
}

export function useTransfers(filters?: TransferFilters) {
  const params = new URLSearchParams();
  
  if (filters?.page) params.set('page', filters.page.toString());
  if (filters?.limit) params.set('limit', filters.limit.toString());
  if (filters?.sort) params.set('sort', filters.sort);

  return useQuery({
    queryKey: ['transfers', filters],
    queryFn: async () => {
      const response = await fetch(`/api/transfers?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transfers: ${response.status}`);
      }
      const data = await response.json();
      return data;
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}