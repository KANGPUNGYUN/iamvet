import React, { useState } from "react";
import { useTextareaContext } from "./TextareaContext";
import { TextareaProps } from "./types";

export const TextareaItem: React.FC<TextareaProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "",
  disabled: itemDisabled = false,
  error: itemError = false,
  rows = 4,
  cols,
  maxLength,
  resize = "vertical",
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // Context에서 상태 가져오기 (Group 내부에서 사용될 때)
  let contextValue: string | undefined;
  let contextOnChange: ((value: string) => void) | undefined;
  let contextDisabled: boolean | undefined;
  let contextError: boolean | undefined;

  try {
    const context = useTextareaContext();
    contextValue = context.value;
    contextOnChange = context.onChange;
    contextDisabled = context.disabled;
    contextError = context.error;
  } catch {
    // Context 없이 독립적으로 사용
    contextValue = undefined;
    contextOnChange = undefined;
    contextDisabled = undefined;
    contextError = undefined;
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (!finalDisabled) {
      if (contextValue === undefined && controlledValue === undefined) {
        setInternalValue(newValue);
      }
      finalOnChange?.(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // 기본 컨테이너 스타일 (제공된 CSS 기반)
  const containerClasses = [
    "flex",
    "w-full max-w-[758px]", // 반응형: 최대 너비는 758px, 작은 화면에서는 full width
    "h-[270px]",
    "px-5 py-4", // padding: 16px 20px
    "items-start",
    "gap-2.5", // gap: 10px
    "flex-shrink-0",
    "rounded-md", // border-radius: 6px
    "bg-[#FAFAFA]", // background: var(--Box, #FAFAFA)
    "transition-colors duration-200",
    "hover:bg-[#FBFBFB]", // 호버 시 배경색
  ].join(" ");

  // Textarea 스타일 (타이포그래픽 스타일 적용)
  const textareaClasses = [
    "w-full h-full",
    "bg-transparent",
    "border-none",
    "outline-none",
    "text-[#3B394D]",
    "text-base",
    "font-medium",
    "leading-[135%]",
    "placeholder-[#9EA5AF]",
    finalDisabled && "cursor-not-allowed opacity-50",
    finalError && "text-red-500 placeholder-red-400",
  ]
    .filter(Boolean)
    .join(" ");

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  }[resize];

  return (
    <div className={`${containerClasses} ${className}`}>
      <textarea
        value={finalValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={finalDisabled}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        className={`${textareaClasses} ${resizeClasses}`}
        aria-invalid={finalError}
        aria-disabled={finalDisabled}
        style={{
          fontFamily: "SUIT, sans-serif", // font-family: SUIT
        }}
      />
      {children}
    </div>
  );
};
