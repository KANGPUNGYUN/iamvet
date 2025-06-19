// src/components/ui/Checkbox/CheckboxItem.tsx
"use client";

import React, { useState } from "react";
import { CheckboxProps } from "./types";
import { useCheckboxContext } from "./CheckboxContext";

const CheckboxItem: React.FC<CheckboxProps> = ({
  value = "",
  children,
  checked: controlledChecked,
  disabled: itemDisabled = false,
  className = "",
  onChange,
}) => {
  const context = useCheckboxContext();
  const [internalChecked, setInternalChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Group context가 있으면 그것을 사용, 없으면 개별 상태 사용
  const isChecked = context
    ? context.value.includes(value)
    : controlledChecked !== undefined
    ? controlledChecked
    : internalChecked;

  const isDisabled = (context?.disabled || itemDisabled) ?? itemDisabled;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      const newChecked = !isChecked;

      // 체크 시에만 애니메이션 트리거
      if (newChecked) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }

      if (context) {
        context.onChange(value, newChecked);
      } else {
        if (controlledChecked === undefined) {
          setInternalChecked(newChecked);
        }
        onChange?.(newChecked, value);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDisabled) {
        const newChecked = !isChecked;

        // 체크 시에만 애니메이션 트리거
        if (newChecked) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 300);
        }

        if (context) {
          context.onChange(value, newChecked);
        } else {
          if (controlledChecked === undefined) {
            setInternalChecked(newChecked);
          }
          onChange?.(newChecked, value);
        }
      }
    }
  };

  // SVG 아이콘 렌더링
  const renderIcon = () => {
    if (isChecked) {
      return (
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "4px",
            background: "#FF8796",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "scale(1)",
            transition: "all 0.2s ease-in-out",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{
              opacity: 1,
              transform: "scale(1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <path
              d="M16.3556 5.2334L7.61675 13.9723L3.64453 10.0001"
              stroke="#F6F6F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="24"
              strokeDashoffset="-24"
              style={{
                animation: "checkmark-draw-ltr 0.4s ease-in-out forwards",
              }}
            />
          </svg>
        </div>
      );
    }

    // Hover 상태
    if (isHovered && !isDisabled) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          style={{
            transition: "all 0.2s ease-in-out",
          }}
        >
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="21"
            rx="3.5"
            fill="#FAFAFA"
            stroke="#EFEFF0"
          />
        </svg>
      );
    }

    // Default 상태
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        style={{
          transition: "all 0.2s ease-in-out",
        }}
      >
        <rect
          x="0.5"
          y="0.5"
          width="21"
          height="21"
          rx="3.5"
          fill="#F6F6F6"
          stroke="#EFEFF0"
        />
      </svg>
    );
  };

  const containerStyle = {
    display: "inline-flex" as const,
    padding: "4px 0px",
    alignItems: "center" as const,
    gap: "8px",
    cursor: isDisabled ? "not-allowed" : "pointer",
  };

  const iconStyle = {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    transition: "all 0.2s ease-in-out",
  };

  const labelStyle = {
    color: isDisabled ? "#CACED6" : "#35313C",
    fontFamily: "suit",
    fontSize: "16px",
    fontWeight: isChecked ? 600 : 500,
    lineHeight: "150%",
    userSelect: "none" as const,
    transition: "font-weight 0.2s ease-in-out",
  };

  return (
    <div
      className={`checkbox-base ${className}`}
      data-checked={isChecked}
      data-disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={isDisabled ? -1 : 0}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      style={containerStyle}
    >
      {/* 실제 input은 화면에서 완전히 제거 */}
      <input
        type="checkbox"
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => {}} // 이벤트는 div에서 처리
        tabIndex={-1}
        style={{ display: "none" }}
      />

      <div style={iconStyle}>{renderIcon()}</div>

      <span style={labelStyle}>{children}</span>
    </div>
  );
};

CheckboxItem.displayName = "Checkbox.Item";

export { CheckboxItem };
