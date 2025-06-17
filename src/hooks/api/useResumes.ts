import { useQuery } from '@tanstack/react-query';

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: () => fetch('/api/resumes').then(res => res.json()),
  });
}