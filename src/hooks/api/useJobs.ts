import { useQuery } from '@tanstack/react-query';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetch('/api/jobs').then(res => res.json()),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetch(`/api/jobs/${id}`).then(res => res.json()),
  });
}