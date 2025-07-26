// src/components/ui/FilterBox/FilterBoxItem.tsx
"use client";

import React, { useState } from "react";
import { FilterBoxProps } from "./types";
import { useFilterBoxContext } from "./FilterBoxContext";

const FilterBoxItem: React.FC<FilterBoxProps> = ({
  value = "",
  children,
  active: controlledActive,
  disabled: itemDisabled = false,
  className = "",
  onChange,
}) => {
  const context = useFilterBoxContext();
  const [internalActive, setInternalActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Group context가 있으면 그것을 사용, 없으면 개별 상태 사용
  const isActive = context
    ? context.value.includes(value)
    : controlledActive !== undefined
    ? controlledActive
    : internalActive;

  const isDisabled = (context?.disabled || itemDisabled) ?? itemDisabled;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      const newActive = !isActive;

      if (context) {
        context.onChange(value, newActive);
      } else {
        if (controlledActive === undefined) {
          setInternalActive(newActive);
        }
        onChange?.(newActive, value);
      }
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      if (context) {
        context.onChange(value, false);
      } else {
        if (controlledActive === undefined) {
          setInternalActive(false);
        }
        onChange?.(false, value);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDisabled) {
        const newActive = !isActive;

        if (context) {
          context.onChange(value, newActive);
        } else {
          if (controlledActive === undefined) {
            setInternalActive(newActive);
          }
          onChange?.(newActive, value);
        }
      }
    }
  };

  // 스타일 결정
  const getContainerStyle = () => {
    const baseStyle = {
      display: "inline-flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: "10px",
      borderRadius: "8px",
      border: "1px solid",
      fontFamily: "SUIT",
      fontSize: "16px",
      fontStyle: "normal" as const,
      fontWeight: 500,
      lineHeight: "135%",
      cursor: isDisabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      userSelect: "none" as const,
    };

    if (isActive) {
      return {
        ...baseStyle,
        padding: "6px 12px 6px 16px",
        borderColor: "var(--Keycolor2, #FFB7B8)",
        background: "var(--Keycolor5, #FFF7F7)",
        color: "var(--Keycolor1, #FF8796)",
      };
    }

    if (isHovered && !isDisabled) {
      return {
        ...baseStyle,
        padding: "6px 16px",
        borderColor: "var(--Line_Hightlight, #DCDCE3)",
        background: "var(--Box, #F6F6F6)",
        color: "var(--text-sub, #707687)",
      };
    }

    return {
      ...baseStyle,
      padding: "6px 16px",
      borderColor: "var(--Line, #EFEFF0)",
      background: "transparent",
      color: isDisabled ? "#CACED6" : "var(--text-sub, #707687)",
    };
  };

  // X 버튼 렌더링
  const renderRemoveButton = () => {
    if (!isActive) return null;

    return (
      <button
        type="button"
        onClick={handleRemoveClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRemoveClick(e as any);
          }
        }}
        tabIndex={0}
        aria-label="필터 제거"
        style={{
          background: "none",
          border: "none",
          padding: "0",
          margin: "0",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          transition: "background-color 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 135, 150, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  return (
    <div
      className={`filter-box-base ${className}`}
      data-active={isActive}
      data-disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={isDisabled ? -1 : 0}
      role="button"
      aria-pressed={isActive}
      aria-disabled={isDisabled}
      style={getContainerStyle()}
    >
      <span>{children}</span>
      {renderRemoveButton()}
    </div>
  );
};

FilterBoxItem.displayName = "FilterBox.Item";

export { FilterBoxItem };
