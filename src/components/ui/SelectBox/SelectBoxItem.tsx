import React, { useState, useEffect, useRef } from "react";
import { useSelectBoxContext } from "./SelectBoxContext";
import { SelectBoxOption } from "./SelectBoxOption";
import { SelectBoxProps, SelectBoxState } from "./types";

export const SelectBoxItem: React.FC<SelectBoxProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "선택하세요",
  options,
  disabled: itemDisabled = false,
  error: itemError = false,
  success: itemSuccess = false,
  state: externalState,
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  let contextValue: string | undefined;
  let contextOnChange: ((value: string) => void) | undefined;
  let contextDisabled: boolean | undefined;
  let contextError: boolean | undefined;
  let contextSuccess: boolean | undefined;

  try {
    const context = useSelectBoxContext();
    contextValue = context.value;
    contextOnChange = context.onChange;
    contextDisabled = context.disabled;
    contextError = context.error;
    contextSuccess = context.success;
  } catch {
    contextValue = undefined;
    contextOnChange = undefined;
    contextDisabled = undefined;
    contextError = undefined;
    contextSuccess = undefined;
  }

  // 실제 사용할 값들 결정
  const finalValue =
    contextValue !== undefined
      ? contextValue
      : controlledValue !== undefined
      ? controlledValue
      : internalValue;
  const finalOnChange = contextOnChange || onChange;
  const finalDisabled = contextDisabled || itemDisabled;
  const finalError = contextError || itemError;
  const finalSuccess = contextSuccess || itemSuccess;

  // 상태 계산
  const calculateState = (): SelectBoxState => {
    if (externalState) return externalState;
    if (isOpen) return "open";
    if (isHovered) return "hover";
    return "default";
  };

  const currentState = calculateState();

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!finalDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (value: string) => {
    if (!finalDisabled) {
      if (contextValue === undefined && controlledValue === undefined) {
        setInternalValue(value);
      }
      finalOnChange?.(value);
      setIsOpen(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 선택된 옵션 찾기
  const selectedOption = options.find((option) => option.value === finalValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // 화살표 아이콘 컴포넌트
  const ArrowIcon = ({ direction }: { direction: "up" | "down" }) => {
    const strokeColor = currentState === "open" ? "#3B394D" : "#9EA5AF";

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
      >
        <path
          d={
            direction === "down"
              ? "M6.5 9.75L13 16.25L19.5 9.75"
              : "M19.5 16.25L13 9.75L6.5 16.25"
          }
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // 상태별 스타일 클래스
  const getStateClasses = (state: SelectBoxState) => {
    const baseClasses = `
      flex
      h-[52px]
      px-[20px]
      py-[16px]
      pr-[14px]
      justify-between
      items-center
      flex-shrink-0
      rounded-[6px]
      border
      transition-all
      duration-200
      focus:outline-none
      cursor-pointer
      overflow-hidden
      text-ellipsis
      whitespace-nowrap
      text-base
      leading-[135%]
    `;

    switch (state) {
      case "hover":
        return `${baseClasses} 
          border-[#EFEFF0] 
          bg-[#FBFBFB]
          text-[#9EA5AF]
          font-semibold
        `;
      case "open":
        return `${baseClasses} 
          border-[#CACAD2] 
          bg-[#FAFAFA]
          text-[#3B394D]
          font-medium
        `;
      default:
        return `${baseClasses} 
          border-[#EFEFF0] 
          bg-[#FAFAFA]
          text-[#9EA5AF]
          font-semibold
        `;
    }
  };

  // 에러/성공 상태 오버라이드
  const getValidationClasses = () => {
    if (finalError) {
      return "border-red-500 bg-red-50 text-red-700";
    }
    if (finalSuccess) {
      return "border-green-500 bg-green-50 text-green-700";
    }
    return "";
  };

  const selectClasses = `${getStateClasses(
    currentState
  )} ${getValidationClasses()}`;

  // 비활성화 상태 오버라이드
  const finalClasses = finalDisabled
    ? `
      flex
      h-[52px]
      px-[20px]
      py-[16px]
      pr-[14px]
      justify-between
      items-center
      flex-shrink-0
      rounded-[6px]
      border
      border-gray-200
      bg-gray-100
      text-gray-400
      cursor-not-allowed
      overflow-hidden
      text-ellipsis
      whitespace-nowrap
      text-base
      leading-[135%]
      font-semibold
    `
    : selectClasses;

  // 텍스트 색상 결정
  const getTextColor = () => {
    if (finalDisabled) return "text-gray-400";
    if (finalError) return "text-red-700";
    if (finalSuccess) return "text-green-700";
    if (selectedOption) {
      return currentState === "open" ? "text-[#3B394D]" : "text-[#9EA5AF]";
    }
    return "text-[#9EA5AF]";
  };

  return (
    <div className={`relative w-fit ${className}`} ref={containerRef}>
      <div
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={finalClasses}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={finalDisabled}
        style={{ fontFamily: "SUIT" }}
      >
        <span className={getTextColor()}>{displayText}</span>
        <ArrowIcon direction={currentState === "open" ? "up" : "down"} />
      </div>

      {isOpen && !finalDisabled && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <SelectBoxOption
              key={option.value}
              value={option.value}
              label={option.label}
              disabled={option.disabled}
              selected={option.value === finalValue}
              onClick={handleOptionClick}
            />
          ))}
        </div>
      )}

      {children}
    </div>
  );
};
