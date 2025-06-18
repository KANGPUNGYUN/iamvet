// src/components/ui/Radio/RadioItem.tsx
"use client";

import React, { useState } from "react";
import { RadioProps } from "./types";
import { useRadioContext } from "./RadioContext";

const RadioItem: React.FC<RadioProps> = ({
  value,
  children,
  disabled: itemDisabled = false,
  className = "",
  onChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    value: groupValue,
    onChange: groupOnChange,
    disabled: groupDisabled,
  } = useRadioContext();
  const isChecked = groupValue === value;
  const isDisabled = groupDisabled || itemDisabled;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled && !isChecked) {
      groupOnChange(value);
      onChange?.(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDisabled && !isChecked) {
        groupOnChange(value);
        onChange?.(value);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isDisabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // SVG 아이콘 렌더링
  const renderIcon = () => {
    if (isDisabled) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
            fill="#EAEAEA"
            fillOpacity="0.6"
          />
        </svg>
      );
    }

    if (isChecked) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 17C13.3833 17 14.5625 16.5125 15.5375 15.5375C16.5125 14.5625 17 13.3833 17 12C17 10.6167 16.5125 9.4375 15.5375 8.4625C14.5625 7.4875 13.3833 7 12 7C10.6167 7 9.4375 7.4875 8.4625 8.4625C7.4875 9.4375 7 10.6167 7 12C7 13.3833 7.4875 14.5625 8.4625 15.5375C9.4375 16.5125 10.6167 17 12 17ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
            fill="#FF8796"
          />
        </svg>
      );
    }

    // Hover 상태 (unchecked + enabled + hovered)
    if (isHovered) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <defs>
            <filter
              id="filter0_d_349_5410"
              x="-18"
              y="-18"
              width="68"
              height="68"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="12" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 0.559063 0 0 0 0 0.706042 0 0 0 0.75 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_349_5410"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_349_5410"
                result="shape"
              />
            </filter>
          </defs>
          {/* 둥근 분홍빛 배경 */}
          <circle cx="16" cy="16" r="16" fill="rgba(255, 135, 150, 0.1)" />
          <g filter="url(#filter0_d_349_5410)">
            <path
              d="M16 26C14.6167 26 13.3167 25.7375 12.1 25.2125C10.8833 24.6875 9.825 23.975 8.925 23.075C8.025 22.175 7.3125 21.1167 6.7875 19.9C6.2625 18.6833 6 17.3833 6 16C6 14.6167 6.2625 13.3167 6.7875 12.1C7.3125 10.8833 8.025 9.825 8.925 8.925C9.825 8.025 10.8833 7.3125 12.1 6.7875C13.3167 6.2625 14.6167 6 16 6C17.3833 6 18.6833 6.2625 19.9 6.7875C21.1167 7.3125 22.175 8.025 23.075 8.925C23.975 9.825 24.6875 10.8833 25.2125 12.1C25.7375 13.3167 26 14.6167 26 16C26 17.3833 25.7375 18.6833 25.2125 19.9C24.6875 21.1167 23.975 22.175 23.075 23.075C22.175 23.975 21.1167 24.6875 19.9 25.2125C18.6833 25.7375 17.3833 26 16 26ZM16 24C18.2333 24 20.125 23.225 21.675 21.675C23.225 20.125 24 18.2333 24 16C24 13.7667 23.225 11.875 21.675 10.325C20.125 8.775 18.2333 8 16 8C13.7667 8 11.875 8.775 10.325 10.325C8.775 11.875 8 13.7667 8 16C8 18.2333 8.775 20.125 10.325 21.675C11.875 23.225 13.7667 24 16 24Z"
              fill="#FF8796"
            />
          </g>
        </svg>
      );
    }

    // Default 상태 (unchecked + not hovered)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
          fill="#EFEFF0"
        />
      </svg>
    );
  };

  return (
    <div
      className={`radio-base ${className}`}
      data-checked={isChecked}
      data-disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={isDisabled ? -1 : 0}
      role="radio"
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
    >
      {/* 실제 input은 화면에서 완전히 제거 */}
      <input
        type="radio"
        className="radio-input"
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => {}} // 이벤트는 div에서 처리
        tabIndex={-1}
        style={{ display: "none" }} // 인라인 스타일로도 숨김
      />

      <div className="radio-icon">{renderIcon()}</div>

      <span className="radio-label">{children}</span>
    </div>
  );
};

RadioItem.displayName = "Radio.Item";

export { RadioItem };
