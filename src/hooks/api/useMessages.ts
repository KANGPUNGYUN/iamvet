import { useQuery } from '@tanstack/react-query';

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => fetch('/api/messages').then(res => res.json()),
  });
}