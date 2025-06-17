import { useQuery } from '@tanstack/react-query';

export function useLectures() {
  return useQuery({
    queryKey: ['lectures'],
    queryFn: () => fetch('/api/lectures').then(res => res.json()),
  });
}