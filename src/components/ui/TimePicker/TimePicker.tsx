import React, { useState, useEffect, useRef } from "react";
import { TimeSelector } from "./TimeSelector";
import { TimePickerProps, TimeValue } from "./types";

export const TimePicker: React.FC<TimePickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "시간을 선택하세요",
  format = "12h",
  minuteStep = 1,
  disabled = false,
  error = false,
  success = false,
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState<TimeValue | null>(
    defaultValue || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 실제 사용할 값 결정
  const finalValue =
    controlledValue !== undefined ? controlledValue : internalValue;

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
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleTimeSelect = (time: TimeValue) => {
    if (!disabled) {
      if (controlledValue === undefined) {
        setInternalValue(time);
      }
      onChange?.(time);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const formatDisplayTime = (time: TimeValue) => {
    const { hour, minute, period } = time;
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");

    return {
      period: period || "",
      hour: formattedHour,
      minute: formattedMinute,
    };
  };

  // 상태별 스타일
  const getContainerStyle = () => {
    let baseStyle = {
      width: "186px",
      height: "52px",
      borderRadius: "6px",
      border: "1px solid #CACAD2",
      background: "#FAFAFA",
      display: "flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      fontFamily: '"Pretendard Variable", sans-serif',
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "135%",
      color: "#4F5866",
    };

    if (disabled) {
      baseStyle.background = "#F5F5F5";
      baseStyle.color = "#9098A4";
      baseStyle.cursor = "not-allowed";
    } else if (error) {
      baseStyle.border = "1px solid #FF4757";
      baseStyle.background = "#FFF5F5";
    } else if (success) {
      baseStyle.border = "1px solid #2ED573";
      baseStyle.background = "#F0FFF4";
    } else if (isOpen) {
      baseStyle.border = "1px solid #007AFF";
      baseStyle.background = "#F0F8FF";
    } else if (isHovered) {
      baseStyle.background = "#F0F0F0";
    }

    return baseStyle;
  };

  const displayText = finalValue ? formatDisplayTime(finalValue) : null;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={getContainerStyle()}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        {finalValue && displayText ? (
          <div
            style={{
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              alignSelf: "stretch",
            }}
          >
            {format === "12h" && (
              <span style={{ color: "#4F5866" }}>{displayText.period}</span>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <span style={{ color: "#4F5866" }}>{displayText.hour}</span>
              <span style={{ color: "#4F5866" }}>:</span>
              <span style={{ color: "#4F5866" }}>{displayText.minute}</span>
            </div>
          </div>
        ) : (
          <span style={{ color: "#9098A4" }}>{placeholder}</span>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 left-0">
          <TimeSelector
            value={finalValue || undefined}
            onChange={handleTimeSelect}
            format={format}
            minuteStep={minuteStep}
            onClose={handleClose}
          />
        </div>
      )}

      {children}
    </div>
  );
};
