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
  clearable = true,
  onClear,
  suffix, // 새로 추가된 prop
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

  const handleClear = () => {
    if (!finalDisabled && !readOnly) {
      const newValue = "";

      // 내부 상태 업데이트
      if (contextValue === undefined && controlledValue === undefined) {
        setInternalValue(newValue);
      }

      // onClear 콜백이 있으면 실행, 없으면 onChange 실행
      if (onClear) {
        onClear();
      } else {
        finalOnChange?.(newValue);
      }
    }
  };

  // 기본 컨테이너 스타일 (반응형)
  const getContainerClasses = (state: InputBoxState) => {
    const baseClasses = [
      "flex",
      "w-full max-w-[758px]",
      "h-[52px]",
      "px-5 py-4",
      "items-center",
      "gap-2.5",
      "flex-shrink-0",
      "rounded-md",
      "transition-all duration-200",
    ];

    return baseClasses.join(" ");
  };

  // 상태별 인라인 스타일
  const getContainerStyle = (state: InputBoxState) => {
    const baseStyle = {
      fontFamily: "SUIT, sans-serif",
    };

    switch (state) {
      case "disabled":
        return {
          ...baseStyle,
          backgroundColor: "rgba(234, 234, 234, 0.6)",
          cursor: "not-allowed",
        };

      case "untouched":
        return {
          ...baseStyle,
          backgroundColor: "#FAFAFA",
        };

      case "hover":
        return {
          ...baseStyle,
          backgroundColor: "#FBFBFB",
        };

      case "focus":
        return {
          ...baseStyle,
          backgroundColor: "#FAFAFA",
          border: "1px solid #CACAD2",
        };

      case "typing":
        return {
          ...baseStyle,
          backgroundColor: "#FAFAFA",
          border: "1px solid #CACAD2",
        };

      case "filled":
        return {
          ...baseStyle,
          backgroundColor: "#FBFBFB",
        };

      default:
        return {
          ...baseStyle,
          backgroundColor: "#FAFAFA",
        };
    }
  };

  // Input 스타일
  const getInputClasses = (state: InputBoxState) => {
    const baseClasses = [
      "w-full",
      "bg-transparent",
      "border-none",
      "outline-none",
      "text-base",
      "font-medium",
      "leading-[135%]",
    ];

    return baseClasses.join(" ");
  };

  // Input 텍스트 색상 (인라인 스타일)
  const getInputStyle = (state: InputBoxState) => {
    const baseStyle = {
      fontFamily: "SUIT, sans-serif",
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "135%",
    };

    if (finalDisabled) {
      return {
        ...baseStyle,
        color: "#9EA5AF",
        cursor: "not-allowed",
      };
    }

    if (state === "typing" || state === "filled") {
      return {
        ...baseStyle,
        color: "#3B394D",
      };
    }

    return {
      ...baseStyle,
      color: "#9EA5AF",
    };
  };

  // Suffix 스타일
  const getSuffixStyle = (state: InputBoxState) => {
    const baseStyle = {
      fontFamily: "SUIT, sans-serif",
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "135%",
      flexShrink: 0,
      marginLeft: "8px",
    };

    if (finalDisabled) {
      return {
        ...baseStyle,
        color: "#4F5866",
      };
    }

    // suffix는 항상 회색으로 표시
    return {
      ...baseStyle,
      color: "#4F5866",
    };
  };

  // 에러/성공 상태 오버라이드
  const getValidationStyles = () => {
    if (finalError) {
      return {
        containerStyle: {
          border: "1px solid #ef4444",
          backgroundColor: "#fef2f2",
        },
        inputStyle: { color: "#dc2626" },
      };
    }
    if (finalSuccess) {
      return {
        containerStyle: {
          border: "1px solid #22c55e",
          backgroundColor: "#f0fdf4",
        },
        inputStyle: { color: "#16a34a" },
      };
    }
    return {
      containerStyle: {},
      inputStyle: {},
    };
  };

  const validationStyles = getValidationStyles();
  const containerClasses = getContainerClasses(currentState);
  const containerStyle = {
    ...getContainerStyle(currentState),
    ...validationStyles.containerStyle,
  };
  const inputClasses = getInputClasses(currentState);
  const inputStyle = {
    ...getInputStyle(currentState),
    ...validationStyles.inputStyle,
  };

  // 클리어 버튼 렌더링 함수
  const renderClearButton = () => {
    // clearable이 false이거나, 값이 없거나, 비활성화/읽기전용이면 버튼 숨김
    if (!clearable || !finalValue || finalDisabled || readOnly) {
      return null;
    }

    // typing이나 filled 상태일 때 표시
    if (currentState !== "typing" && currentState !== "filled") {
      return null;
    }

    return (
      <button
        type="button"
        onClick={handleClear}
        className="flex items-center justify-center w-5 h-5 ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
        aria-label="입력 내용 지우기"
        onMouseDown={(e) => e.preventDefault()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <rect
            width="20"
            height="20"
            rx="10"
            fill="#3B394D"
            fillOpacity="0.2"
          />
          <path
            d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  // Suffix 렌더링 함수
  const renderSuffix = () => {
    if (!suffix) return null;

    return <span style={getSuffixStyle(currentState)}>{suffix}</span>;
  };

  const renderGuide = () => {
    if (!finalGuide) return null;

    const getGuideClasses = () => {
      return "mt-1 text-sm font-bold leading-[135%]";
    };

    const getGuideStyle = () => {
      const baseStyle = {
        fontFamily: "SUIT, sans-serif",
        fontSize: "14px",
        fontWeight: 700,
        lineHeight: "135%",
      };

      if (finalGuide.type === "success") {
        return { ...baseStyle, color: "#34C759" };
      }
      if (finalGuide.type === "error") {
        return { ...baseStyle, color: "#FF4A4A" };
      }
      return { ...baseStyle, color: "#9098A4" };
    };

    return (
      <div
        className={`${getGuideClasses()} ${finalGuide.className || ""}`}
        style={getGuideStyle()}
      >
        {finalGuide.text}
      </div>
    );
  };

  return (
    <div className={className}>
      <div className={containerClasses} style={containerStyle}>
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
          className={`${inputClasses} placeholder-[#9EA5AF]`}
          style={inputStyle}
          aria-invalid={finalError}
          aria-disabled={finalDisabled}
          aria-readonly={readOnly}
          aria-required={required}
        />
        {renderSuffix()}
        {renderClearButton()}
      </div>

      {renderGuide()}
      {children}
    </div>
  );
};
