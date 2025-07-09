import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "./Calendar";
import { DateRangePickerProps } from "./types";

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate: controlledStartDate,
  endDate: controlledEndDate,
  defaultStartDate,
  defaultEndDate,
  onChange,
  placeholder = "시작일 ~ 종료일",
  disabled = false,
  error = false,
  success = false,
  minDate,
  maxDate,
  className = "",
  children,
}) => {
  const [internalStartDate, setInternalStartDate] = useState<Date | null>(
    defaultStartDate || null
  );
  const [internalEndDate, setInternalEndDate] = useState<Date | null>(
    defaultEndDate || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 실제 사용할 값들 결정
  const finalStartDate =
    controlledStartDate !== undefined ? controlledStartDate : internalStartDate;
  const finalEndDate =
    controlledEndDate !== undefined ? controlledEndDate : internalEndDate;

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

  const handleRangeSelect = (startDate: Date | null, endDate: Date | null) => {
    if (!disabled) {
      if (
        controlledStartDate === undefined &&
        controlledEndDate === undefined
      ) {
        setInternalStartDate(startDate);
        setInternalEndDate(endDate);
      }
      onChange?.(startDate, endDate);

      // 범위가 완전히 선택되면 달력 닫기
      if (startDate && endDate) {
        setIsOpen(false);
      }
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

  // 컨테이너 스타일 (가변 너비, 항상 아이콘 표시)
  const containerStyle: React.CSSProperties = {
    display: "flex",
    minWidth: "186px",
    height: "52px",
    padding: "0px 10px",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
    borderRadius: "6px",
    background: "#FAFAFA",
    border: "1px solid var(--Line_Hightlight, #CACAD2)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    width: "fit-content",
  };

  // 텍스트 스타일
  const getTextStyle = (): React.CSSProperties => {
    const hasAnySelection = finalStartDate || finalEndDate;
    if (hasAnySelection) {
      return {
        color: "#4F5866",
        fontFamily: "SUIT",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "135%",
        whiteSpace: "nowrap",
        flex: 1,
      };
    }

    // placeholder 스타일
    return {
      color: "#9EA5AF",
      fontFamily: "SUIT",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: 600,
      lineHeight: "135%",
      whiteSpace: "nowrap",
      flex: 1,
    };
  };

  const getDisplayText = () => {
    if (finalStartDate && finalEndDate) {
      return `${formatDisplayDate(finalStartDate)} - ${formatDisplayDate(
        finalEndDate
      )}`;
    }
    if (finalStartDate) {
      return `${formatDisplayDate(finalStartDate)} - 종료일 선택`;
    }
    return placeholder;
  };

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
          <span style={getTextStyle()}>{getDisplayText()}</span>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 left-0">
            <Calendar
              startDate={finalStartDate || undefined}
              endDate={finalEndDate || undefined}
              onRangeChange={handleRangeSelect}
              minDate={minDate}
              maxDate={maxDate}
              isRange={true}
            />
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
