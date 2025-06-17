import { useQuery } from '@tanstack/react-query';

export function useTransfers() {
  return useQuery({
    queryKey: ['transfers'],
    queryFn: () => fetch('/api/transfers').then(res => res.json()),
  });
}