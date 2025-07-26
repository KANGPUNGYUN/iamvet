// src/components/ui/Tag/TagItem.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TagProps } from "./types";
import { useTagContext } from "./TagContext";

const TagItem: React.FC<TagProps> = ({
  children,
  variant = 1,
  className = "",
  onClick,
  disabled = false,
}) => {
  const context = useTagContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 반응형을 위한 resize 이벤트 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled && onClick) {
        onClick();
      }
    }
  };

  // 반응형 패딩과 폰트 사이즈를 위한 함수
  const getResponsiveStyles = () => {
    return {
      padding: isMobile ? "3px 10px" : "6px 16px",
      fontSize: isMobile ? "13px" : "14px",
    };
  };

  const getTagStyles = () => {
    const responsiveStyles = getResponsiveStyles();

    const baseStyle = {
      display: "inline-flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: "10px",
      borderRadius: "999px",
      fontFamily: 'var(--font-title)',
      fontStyle: "normal" as const,
      fontWeight: 400,
      lineHeight: "135%",
      cursor: onClick && !disabled ? "pointer" : "default",
      transition: "all 0.2s ease-in-out",
      userSelect: "none" as const,
      opacity: disabled ? 0.5 : 1,
      boxSizing: "border-box" as const,
      border: "none",
      outline: "none",
      ...responsiveStyles, // 반응형 패딩과 폰트 사이즈 적용
    };

    // 색상 설정
    const getVariantStyles = () => {
      switch (variant) {
        case 1:
          return {
            background: "var(--Keycolor5, #FFF7F7)",
            color: "var(--Keycolor1, #FF8796)",
          };
        case 2:
          return {
            background: "var(--Keycolor1, #FF8796)",
            color: "#FFF",
          };
        case 3:
          return {
            background: "var(--Box_Light, #FAFAFA)",
            color: "var(--Subtext, #4F5866)",
          };
        case 4:
          return {
            background: "var(--Subtext, #4F5866)",
            color: "var(--Box_Light, #FAFAFA)",
          };
        case 5:
          return {
            background: "rgba(79, 88, 102, 0.80)",
            color: "var(--Box_Light, #FAFAFA)",
          };
        case 6:
          return {
            background: "var(--Box, #F6F6F6)",
            color: "var(--Subtext2, #9098A4)",
          };
        default:
          return {
            background: "var(--Keycolor5, #FFF7F7)",
            color: "var(--Keycolor1, #FF8796)",
          };
      }
    };

    return {
      ...baseStyle,
      ...getVariantStyles(),
    };
  };

  return (
    <span
      className={`tag-item tag-variant-${variant} ${className}`}
      data-variant={variant}
      data-disabled={disabled}
      onClick={handleClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={onClick && !disabled ? 0 : -1}
      role={onClick ? "button" : undefined}
      aria-disabled={disabled}
      style={getTagStyles()}
    >
      {children}
    </span>
  );
};

TagItem.displayName = "Tag.Item";

export { TagItem };
