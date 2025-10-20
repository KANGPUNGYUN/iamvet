"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createResumeNavigationHandler, useHospitalAuth } from "@/utils/hospitalAuthGuard";

interface HospitalOnlyButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  showAuthModal?: (returnUrl?: string) => void;
}

export const HospitalOnlyButton: React.FC<HospitalOnlyButtonProps> = ({
  href,
  children,
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  showAuthModal,
}) => {
  const router = useRouter();
  const { isAuthenticated, userType } = useHospitalAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (href.startsWith('/resumes') && showAuthModal) {
      const handleResumeNavigation = createResumeNavigationHandler(
        router, 
        isAuthenticated, 
        userType, 
        showAuthModal
      );
      handleResumeNavigation(href);
    } else {
      router.push(href);
    }
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
};