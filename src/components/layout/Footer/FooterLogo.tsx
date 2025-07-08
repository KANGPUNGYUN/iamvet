// src/components/layout/Footer/FooterLogo.tsx
"use client";

import React from "react";
import { FooterLogoProps } from "./types";

const FooterLogo: React.FC<FooterLogoProps> = ({
  src,
  mobileSrc, // 모바일용 로고 경로 추가
  alt = "Logo",
  children,
  className = "",
}) => {
  return (
    <div className={`footer-logo ${className}`}>
      {src ? (
        <>
          {/* 데스크톱용 로고 */}
          <img src={src} alt={alt} className="logo-desktop" />
          {/* 모바일용 로고 (mobileSrc가 있을 때만) */}
          {mobileSrc && (
            <img src={mobileSrc} alt={alt} className="logo-mobile" />
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
};

FooterLogo.displayName = "Footer.Logo";

export { FooterLogo };
