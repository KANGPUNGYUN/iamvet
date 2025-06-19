// src/components/ui/Pagination/PaginationButton.tsx
"use client";

import React, { useState } from "react";
import { PaginationButtonProps } from "./types";

const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  state,
  isActive = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const getButtonStyles = () => {
    const baseStyle = {
      display: "flex" as const,
      width: "40px",
      height: "40px",
      padding: "0",
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      flexShrink: 0,
      borderRadius: "8px",
      fontFamily: "Pretendard, sans-serif",
      fontSize: "14px",
      fontStyle: "normal" as const,
      fontWeight: 500,
      lineHeight: "1",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      userSelect: "none" as const,
      boxSizing: "border-box" as const,
      outline: "none",
      border: "1px solid transparent",
    };

    // 상태별 스타일 결정
    const getCurrentState = () => {
      if (disabled) return "disabled";
      if (isActive) return "active";
      if (isHovered && !disabled) return "hover";
      return "default";
    };

    const currentState = state || getCurrentState();

    const getStateStyles = () => {
      switch (currentState) {
        case "active":
          return {
            background: "#FF8796",
            color: "#FFF",
            border: "1px solid #FF8796",
          };
        case "hover":
          return {
            border: "1px solid #FFF7F7",
            background: "#FFF7F7",
            color: "#3B394D",
          };
        case "disabled":
          return {
            border: "1px solid #EFEFF0",
            background: "#FFF",
            color: "#9098A4",
          };
        case "default":
        default:
          return {
            border: "1px solid #EFEFF0",
            background: "#FFF",
            color: "#3B394D",
          };
      }
    };

    return {
      ...baseStyle,
      ...getStateStyles(),
    };
  };

  return (
    <button
      className={`pagination-button ${className}`}
      data-state={isActive ? "active" : disabled ? "disabled" : "default"}
      data-disabled={disabled}
      onClick={handleClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      aria-disabled={disabled}
      style={getButtonStyles()}
    >
      {children}
    </button>
  );
};

PaginationButton.displayName = "Pagination.Button";

export { PaginationButton };
