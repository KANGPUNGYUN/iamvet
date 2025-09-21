import { useQuery } from '@tanstack/react-query';

interface LectureFilters {
  medicalField?: string;
  sort?: string;
  limit?: number;
  page?: number;
  keyword?: string;
  animal?: string;
  difficulty?: string;
}

export function useLectures(filters?: LectureFilters) {
  const params = new URLSearchParams();
  
  if (filters?.medicalField) params.set('medicalField', filters.medicalField);
  if (filters?.sort) params.set('sort', filters.sort);
  if (filters?.limit) params.set('limit', filters.limit.toString());
  if (filters?.page) params.set('page', filters.page.toString());
  if (filters?.keyword) params.set('keyword', filters.keyword);
  if (filters?.animal) params.set('animal', filters.animal);
  if (filters?.difficulty) params.set('difficulty', filters.difficulty);

  return useQuery({
    queryKey: ['lectures', filters],
    queryFn: () => fetch(`/api/lectures?${params.toString()}`).then(res => res.json()),
  });
}