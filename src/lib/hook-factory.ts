/**
 * Hook Factory Pattern Implementation
 *
 * Creates standardized React Query hooks for both Server Actions and API Routes
 * Following PROJECT_ARCHITECTURE.md guidelines
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  AuthResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/types/auth";

// Hook Factory for Server Actions
export function createServerActionHook<TData, TVariables>(
  actionFn: (variables: TVariables) => Promise<AuthResponse<TData>>,
  options?: {
    onSuccess?: (data: AuthResponse<TData>, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  }
) {
  return function useServerAction() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: actionFn,
      onSuccess: (data, variables) => {
        // Invalidate relevant queries on success
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        options?.onSuccess?.(data, variables);
      },
      onError: options?.onError,
    } as UseMutationOptions<AuthResponse<TData>, Error, TVariables>);
  };
}

// Hook Factory for API Routes
export function createApiHook<TData, TVariables>(
  endpoint: string,
  options?: {
    queryKey?: string[];
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  }
) {
  return {
    // Query hook
    useQuery: function (
      variables?: TVariables,
      queryOptions?: UseQueryOptions<TData>
    ) {
      return useQuery({
        queryKey: options?.queryKey || [endpoint, variables],
        queryFn: async () => {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(variables),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          return response.json() as Promise<TData>;
        },
        ...queryOptions,
      });
    },

    // Mutation hook
    useMutation: function () {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async (variables: TVariables): Promise<TData> => {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(variables),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          return response.json() as Promise<TData>;
        },
        onSuccess: (data) => {
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: options?.queryKey });
          options?.onSuccess?.(data);
        },
        onError: options?.onError,
      } as UseMutationOptions<TData, Error, TVariables>);
    },
  };
}

// Specialized Social Login Hook Factory
export function createSocialLoginHook(provider: "google" | "kakao" | "naver") {
  return function useSocialLogin(
    userType: "veterinarian" | "hospital" | "veterinary-student"
  ) {
    const baseUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        : "http://localhost:3000";

    const initiateLogin = (
      onSuccess?: (data: SocialLoginResponse) => void,
      onError?: (error: string) => void
    ) => {
      const socialLoginUrl = `${baseUrl}/api/auth/${provider}/login?userType=${userType}`;

      // Always use redirect flow instead of popup
      window.location.href = socialLoginUrl;
    };

    return { initiateLogin };
  };
}

// Query Keys Management
export const authQueryKeys = {
  all: ["auth"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
  profile: (userId: string) =>
    [...authQueryKeys.all, "profile", userId] as const,
  social: () => [...authQueryKeys.all, "social"] as const,
} as const;
