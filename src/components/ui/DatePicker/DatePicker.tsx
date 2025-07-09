import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "./Calendar";
import { DatePickerProps } from "./types";

export const DatePicker: React.FC<DatePickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "날짜를 선택하세요",
  disabled = false,
  error = false,
  success = false,
  minDate,
  maxDate,
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState<Date | null>(
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

  const handleDateSelect = (date: Date) => {
    if (!disabled) {
      if (controlledValue === undefined) {
        setInternalValue(date);
      }
      onChange?.(date);
      setIsOpen(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 캘린더 아이콘 컴포넌트 (항상 표시)
  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="31"
      viewBox="0 0 28 31"
      fill="none"
    >
      <path
        d="M20.3948 7.78882H7.54268C6.52868 7.78882 5.70667 8.70216 5.70667 9.82883V24.1089C5.70667 25.2356 6.52868 26.149 7.54268 26.149H20.3948C21.4088 26.149 22.2308 25.2356 22.2308 24.1089V9.82883C22.2308 8.70216 21.4088 7.78882 20.3948 7.78882Z"
        stroke="#9098A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.6417 5.75049V9.83052"
        stroke="#9098A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2946 5.75049V9.83052"
        stroke="#9098A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.70667 13.9119H22.2308"
        stroke="#9098A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // 컨테이너 스타일 (고정 크기, 항상 아이콘 표시)
  const containerStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "52px",
    padding: "0px 10px",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
    borderRadius: "6px",
    background: "#FAFAFA",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    border: "1px solid var(--Line_Hightlight, #CACAD2)",
  };

  // 텍스트 스타일
  const getTextStyle = (): React.CSSProperties => {
    const hasSelectedDate = !!finalValue;
    if (hasSelectedDate) {
      return {
        color: "#4F5866",
        fontFamily: "SUIT",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 600,
      };
    }

    // placeholder 스타일
    return {
      color: "#9EA5AF",
      fontFamily: "SUIT",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: 600,
    };
  };

  const displayText = finalValue ? formatDisplayDate(finalValue) : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <div
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={containerStyle}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          <CalendarIcon />
          <span style={getTextStyle()}>{displayText}</span>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 left-0">
            <Calendar
              value={finalValue || undefined}
              onChange={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
