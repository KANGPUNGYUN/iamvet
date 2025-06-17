import { useQuery } from '@tanstack/react-query';

export function useHospitals() {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: () => fetch('/api/hospitals').then(res => res.json()),
  });
}