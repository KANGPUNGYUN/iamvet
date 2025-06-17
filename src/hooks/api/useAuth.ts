import { useMutation, useQuery } from '@tanstack/react-query';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: any) => {
      return fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: any) => {
      return fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
    },
  });
}