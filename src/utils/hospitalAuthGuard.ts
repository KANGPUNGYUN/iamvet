"use client";

import { useAuthStore } from "@/stores/authStore";

export interface HospitalAuthResult {
  isHospitalUser: boolean;
  isAuthenticated: boolean;
  userType: string | null;
}

export interface HospitalAuthModalHandler {
  showModal: (returnUrl?: string) => void;
  isModalOpen: boolean;
  closeModal: () => void;
  modalReturnUrl: string | undefined;
}

export function useHospitalAuth(): HospitalAuthResult {
  const { isAuthenticated, userType } = useAuthStore();
  
  return {
    isHospitalUser: isAuthenticated && userType === 'HOSPITAL',
    isAuthenticated,
    userType
  };
}

export function checkHospitalAuthForNavigation(
  isAuthenticated: boolean, 
  userType: string | null
): boolean {
  return isAuthenticated && userType === 'HOSPITAL';
}

export function createResumeNavigationHandler(
  router: any,
  isAuthenticated: boolean,
  userType: string | null,
  showAuthModal: (returnUrl?: string) => void
) {
  return (path: string) => {
    if (checkHospitalAuthForNavigation(isAuthenticated, userType)) {
      router.push(path);
    } else {
      showAuthModal(path);
    }
  };
}

// 기존 함수는 호환성을 위해 유지하되, 모달 사용을 권장
export function handleResumeNavigation(
  router: any,
  path: string,
  isAuthenticated: boolean,
  userType: string | null
): void {
  if (checkHospitalAuthForNavigation(isAuthenticated, userType)) {
    router.push(path);
  } else {
    // 병원 로그인 페이지로 리다이렉트하면서 원래 가려던 페이지 정보를 저장
    const returnUrl = encodeURIComponent(path);
    router.push(`/login/hospital?returnUrl=${returnUrl}`);
  }
}