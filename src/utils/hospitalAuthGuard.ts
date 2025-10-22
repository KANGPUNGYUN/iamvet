"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export interface HospitalAuthResult {
  isHospitalUser: boolean;
  isAuthenticated: boolean;
  userType: string | null;
  isLoading: boolean;
}

export interface HospitalAuthModalHandler {
  showModal: (returnUrl?: string) => void;
  isModalOpen: boolean;
  closeModal: () => void;
  modalReturnUrl: string | undefined;
}

export function useHospitalAuth(): HospitalAuthResult {
  const { isAuthenticated, userType } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    // 클라이언트 사이드에서 초기화가 완료되면 로딩 상태 해제
    const timer = setTimeout(() => {
      setHasInitialized(true);
    }, 50); // 매우 짧은 지연
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // authStore 상태가 변경되거나 초기화가 완료되면 로딩 해제
    if (hasInitialized) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 150); // 부드러운 전환을 위한 약간의 지연
      
      return () => clearTimeout(timer);
    }
  }, [hasInitialized, isAuthenticated, userType]);
  
  return {
    isHospitalUser: isAuthenticated && userType === 'HOSPITAL',
    isAuthenticated,
    userType,
    isLoading
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