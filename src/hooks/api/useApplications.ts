import { useQuery } from '@tanstack/react-query';

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch('/api/applications').then(res => res.json()),
  });
}