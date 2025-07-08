import React, { useState, useEffect } from "react";
import { useInputBoxContext } from "./InputBoxContext";
import { InputBoxGuide } from "./InputBoxGuide";
import { InputBoxProps, InputBoxState } from "./types";

export const InputBoxItem: React.FC<InputBoxProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "",
  type = "text",
  disabled: itemDisabled = false,
  error: itemError = false,
  success: itemSuccess = false,
  readOnly = false,
  maxLength,
  autoComplete,
  autoFocus = false,
  required = false,
  state: externalState,
  guide: itemGuide,
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalState, setInternalState] =
    useState<InputBoxState>("untouched");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  // Context에서 상태 가져오기 (Group 내부에서 사용될 때)
  let contextValue: string | undefined;
  let contextOnChange: ((value: string) => void) | undefined;
  let contextDisabled: boolean | undefined;
  let contextError: boolean | undefined;
  let contextSuccess: boolean | undefined;
  let contextGuide: any | undefined;

  try {
    const context = useInputBoxContext();
    contextValue = context.value;
    contextOnChange = context.onChange;
    contextDisabled = context.disabled;
    contextError = context.error;
    contextSuccess = context.success;
    contextGuide = context.guide;
  } catch {
    // Context 없이 독립적으로 사용
    contextValue = undefined;
    contextOnChange = undefined;
    contextDisabled = undefined;
    contextError = undefined;
    contextSuccess = undefined;
    contextGuide = undefined;
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
  const finalGuide = contextGuide || itemGuide;

  // 상태 계산
  const calculateState = (): InputBoxState => {
    if (externalState) return externalState;
    if (finalDisabled) return "disabled";
    if (!hasBeenTouched) return "untouched";
    if (isFocused) {
      return finalValue ? "typing" : "focus";
    }
    if (isHovered && !finalValue) return "hover";
    if (finalValue) return "filled";
    return "default";
  };

  const currentState = calculateState();

  useEffect(() => {
    setInternalState(currentState);
  }, [currentState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!finalDisabled && !readOnly) {
      if (contextValue === undefined && controlledValue === undefined) {
        setInternalValue(newValue);
      }
      finalOnChange?.(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasBeenTouched(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 기본 컨테이너 스타일 (반응형)
  const getContainerClasses = (state: InputBoxState) => {
    const baseClasses = [
      "flex",
      "w-full max-w-[758px]", // 반응형: 최대 너비 758px
      "h-[52px]",
      "px-5 py-4", // padding: 16px 20px
      "items-center",
      "gap-2.5", // gap: 10px
      "flex-shrink-0",
      "rounded-md", // border-radius: 6px
      "transition-all duration-200",
    ];

    // 상태별 스타일
    switch (state) {
      case "disabled":
        return [
          ...baseClasses,
          "bg-[rgba(234,234,234,0.6)]", // var(--Box_Disable)
          "cursor-not-allowed",
        ].join(" ");

      case "untouched":
        return [
          ...baseClasses,
          "bg-[#FAFAFA]", // var(--Box)
        ].join(" ");

      case "hover":
        return [
          ...baseClasses,
          "bg-[#FBFBFB]", // var(--Box_Light)
        ].join(" ");

      case "focus":
        return [
          ...baseClasses,
          "bg-[#FAFAFA]", // var(--Box)
          "border border-[#CACAD2]", // var(--Line_Hightlight)
        ].join(" ");

      case "typing":
        return [
          ...baseClasses,
          "bg-[#FAFAFA]", // var(--Box)
          "border border-[#CACAD2]", // var(--Line_Hightlight)
          "justify-between",
        ].join(" ");

      case "filled":
        return [
          ...baseClasses,
          "bg-[#FBFBFB]", // var(--Box_Light)
        ].join(" ");

      default:
        return [
          ...baseClasses,
          "bg-[#FAFAFA]", // var(--Box)
        ].join(" ");
    }
  };

  // Input 스타일
  const getInputClasses = (state: InputBoxState) => {
    const baseClasses = [
      "w-full",
      "bg-transparent",
      "border-none",
      "outline-none",
      "text-base", // font-size: 16px
      "font-medium", // font-weight: 500
      "leading-[135%]", // line-height: 135%
    ];

    // 상태별 텍스트 색상
    const getTextColor = () => {
      if (finalDisabled) return "text-[#9EA5AF]"; // var(--Guidetext)
      if (state === "typing" || state === "filled") return "text-[#3B394D]"; // var(--Text)
      return "text-[#9EA5AF]"; // var(--Guidetext)
    };

    return [
      ...baseClasses,
      getTextColor(),
      "placeholder-[#9EA5AF]", // placeholder color
      finalDisabled && "cursor-not-allowed",
    ]
      .filter(Boolean)
      .join(" ");
  };

  // 에러/성공 상태 오버라이드
  const getValidationStyles = () => {
    if (finalError) {
      return {
        containerOverride: "border border-red-500 bg-red-50",
        inputOverride: "text-red-700",
      };
    }
    if (finalSuccess) {
      return {
        containerOverride: "border border-green-500 bg-green-50",
        inputOverride: "text-green-700",
      };
    }
    return { containerOverride: "", inputOverride: "" };
  };

  const validationStyles = getValidationStyles();
  const containerClasses = `${getContainerClasses(currentState)} ${
    validationStyles.containerOverride
  }`;
  const inputClasses = `${getInputClasses(currentState)} ${
    validationStyles.inputOverride
  }`;

  // 가이드 텍스트 컴포넌트 (CSS 기반)
  const renderGuide = () => {
    if (!finalGuide) return null;

    const getGuideClasses = () => {
      const baseClasses = [
        "mt-1",
        "text-sm", // font-size: 14px
        "font-bold", // font-weight: 700
        "leading-[135%]", // line-height: 135%
      ];

      if (finalGuide.type === "success") {
        return [...baseClasses, "text-[#34C759]"].join(" "); // var(--Colors-Green)
      }
      if (finalGuide.type === "error") {
        return [...baseClasses, "text-[#FF4A4A]"].join(" "); // var(--pointcolor-red-default)
      }
      return [...baseClasses, "text-[#9098A4]"].join(" "); // var(--Subtext2)
    };

    return (
      <div
        className={`${getGuideClasses()} ${finalGuide.className || ""}`}
        style={{ fontFamily: "SUIT, sans-serif" }}
      >
        {finalGuide.text}
      </div>
    );
  };

  return (
    <div className={className}>
      <div className={containerClasses}>
        <input
          type={type}
          value={finalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          placeholder={placeholder}
          disabled={finalDisabled}
          readOnly={readOnly}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          className={inputClasses}
          aria-invalid={finalError}
          aria-disabled={finalDisabled}
          aria-readonly={readOnly}
          aria-required={required}
          style={{ fontFamily: "SUIT, sans-serif" }}
        />
      </div>

      {renderGuide()}
      {children}
    </div>
  );
};
