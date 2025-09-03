import React, { useState, useEffect } from "react";
import { useTextareaContext } from "./TextareaContext";
import { TextareaProps } from "./types";

type TextareaState =
  | "untouched"
  | "hover"
  | "focus"
  | "typing"
  | "filled"
  | "disabled"
  | "default";

export const TextareaItem: React.FC<TextareaProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "",
  disabled: itemDisabled = false,
  error: itemError = false,
  success: itemSuccess = false,
  rows = 4,
  cols,
  maxLength,
  resize = "vertical",
  state: externalState,
  className = "",
  fullWidth = false,
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalState, setInternalState] =
    useState<TextareaState>("untouched");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  let contextValue: string | undefined;
  let contextOnChange: ((value: string) => void) | undefined;
  let contextDisabled: boolean | undefined;
  let contextError: boolean | undefined;
  let contextSuccess: boolean | undefined;

  try {
    const context = useTextareaContext();
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

  const calculateState = (): TextareaState => {
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

  const getContainerClasses = (state: TextareaState) => {
    const baseClasses = [
      "flex",
      fullWidth ? "w-full min-w-0" : "w-full max-w-[758px]",
      "min-h-[270px]",
      "px-5 py-4",
      "items-start",
      "gap-2.5",
      fullWidth ? "" : "flex-shrink-0",
      "rounded-md",
      "transition-all duration-200",
    ].filter(cls => cls !== "");

    return baseClasses.join(" ");
  };

  const getContainerStyle = (state: TextareaState) => {
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

  const getTextareaClasses = (state: TextareaState) => {
    const baseClasses = [
      "w-full",
      "min-h-[238px]",
      "bg-transparent",
      "border-none",
      "outline-none",
      "text-base",
      "font-medium",
      "leading-[135%]",
    ];

    return baseClasses.join(" ");
  };

  const getTextareaStyle = (state: TextareaState) => {
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

  const getValidationStyles = () => {
    if (finalError) {
      return {
        containerStyle: {
          border: "1px solid #ef4444",
          backgroundColor: "#fef2f2",
        },
        textareaStyle: { color: "#dc2626" },
      };
    }
    if (finalSuccess) {
      return {
        containerStyle: {
          border: "1px solid #22c55e",
          backgroundColor: "#f0fdf4",
        },
        textareaStyle: { color: "#16a34a" },
      };
    }
    return {
      containerStyle: {},
      textareaStyle: {},
    };
  };

  const validationStyles = getValidationStyles();
  const containerClasses = getContainerClasses(currentState);
  const containerStyle = {
    ...getContainerStyle(currentState),
    ...validationStyles.containerStyle,
  };
  const textareaClasses = getTextareaClasses(currentState);
  const textareaStyle = {
    ...getTextareaStyle(currentState),
    ...validationStyles.textareaStyle,
  };

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  }[resize];

  return (
    <div className={className}>
      <div
        className={containerClasses}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
          className={`${textareaClasses} ${resizeClasses} placeholder-[#9EA5AF]`}
          style={textareaStyle}
          aria-invalid={finalError}
          aria-disabled={finalDisabled}
        />
      </div>
      {children}
    </div>
  );
};
