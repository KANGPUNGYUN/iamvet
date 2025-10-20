"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HospitalOnlyButton } from "@/components/ui/HospitalOnlyButton";
import { useHospitalAuthModal } from "@/hooks/useHospitalAuthModal";
import { HospitalAuthModal } from "@/components/ui/HospitalAuthModal";
import { HeaderNavigationProps } from "./types";

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  items,
  className = "",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { showModal, isModalOpen, closeModal, modalReturnUrl } = useHospitalAuthModal();

  return (
    <nav className={`flex gap-[26px] items-center ${className}`}>
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const isActive = item.active;
        const shouldShowLine = isHovered || isActive;

        const isResumeRoute = item.href.startsWith('/resumes');
        
        const linkStyle = {
          position: "relative" as const,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "flex-end" as const,
          alignItems: "center" as const,
          gap: "6px",
          flexShrink: 0,
          color:
            isHovered || isActive
              ? "var(--Keycolor1, #FF8796)"
              : "var(--text-default, #35313C)",
          textAlign: "center" as const,
          fontFamily: "SUIT",
          fontSize: "18px",
          fontStyle: "normal" as const,
          fontWeight: "500",
          textDecoration: "none",
          transition: "color 0.2s ease",
          border: "none",
          background: "none",
          cursor: "pointer",
        };

        const LinkComponent = isResumeRoute ? HospitalOnlyButton : Link;

        return (
          <LinkComponent
            key={index}
            href={item.href}
            style={linkStyle}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            {...(isResumeRoute ? { showAuthModal: showModal } : {})}
          >
            {item.label}
            <div
              style={{
                position: "absolute",
                bottom: "-3px",
                left: shouldShowLine ? "0" : "50%",
                width: shouldShowLine ? "100%" : "0",
                height: "1px",
                background: "var(--Keycolor1, #FF8796)",
                transition: "width 0.3s ease, left 0.3s ease",
              }}
            />
          </LinkComponent>
        );
      })}
      
      {/* 병원 인증 모달 */}
      <HospitalAuthModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        returnUrl={modalReturnUrl}
      />
    </nav>
  );
};
