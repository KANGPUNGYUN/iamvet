import React, { useState, useMemo } from "react";
import { CalendarProps } from "./types";

export const Calendar: React.FC<CalendarProps> = ({
  value,
  startDate,
  endDate,
  onChange,
  onRangeChange,
  minDate,
  maxDate,
  isRange = false,
  className = "",
}) => {
  const [currentDate, setCurrentDate] = useState(
    value || startDate || new Date()
  );
  const [rangeStart, setRangeStart] = useState<Date | null>(startDate || null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(endDate || null);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // 이전 달의 빈 날짜들
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (isRange) {
      if (rangeStart && isSameDay(date, rangeStart)) return true;
      if (rangeEnd && isSameDay(date, rangeEnd)) return true;
      return false;
    }
    return value && isSameDay(date, value);
  };

  const isDateInRange = (date: Date) => {
    if (!isRange || !rangeStart || !rangeEnd) return false;
    return date >= rangeStart && date <= rangeEnd;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (isRange) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
      } else {
        const newEndDate = date >= rangeStart ? date : rangeStart;
        const newStartDate = date >= rangeStart ? rangeStart : date;
        setRangeStart(newStartDate);
        setRangeEnd(newEndDate);
        onRangeChange?.(newStartDate, newEndDate);
      }
    } else {
      onChange?.(date);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearSelector(false);
  };

  const handleMonthSelect = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setShowMonthSelector(false);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = minDate ? minDate.getFullYear() : currentYear - 10;
    const endYear = maxDate ? maxDate.getFullYear() : currentYear + 10;

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const ChevronLeft = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );

  const ChevronRight = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  return (
    <div
      className={`bg-white border border-gray-300 rounded-lg shadow-lg p-4 relative ${className}`}
      style={{ minWidth: "280px" }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowYearSelector(!showYearSelector);
              setShowMonthSelector(false);
            }}
            className="px-2 py-1 hover:bg-gray-100 rounded transition-colors font-semibold text-gray-900"
            type="button"
          >
            {currentDate.getFullYear()}년
          </button>
          <button
            onClick={() => {
              setShowMonthSelector(!showMonthSelector);
              setShowYearSelector(false);
            }}
            className="px-2 py-1 hover:bg-gray-100 rounded transition-colors font-semibold text-gray-900"
            type="button"
          >
            {currentDate.getMonth() + 1}월
          </button>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <ChevronRight />
        </button>
      </div>

      {/* 연도 선택 드롭다운 */}
      {showYearSelector && (
        <div className="absolute top-16 left-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-3 gap-1 p-2">
            {generateYearOptions().map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`p-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                  year === currentDate.getFullYear()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-700"
                }`}
                type="button"
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 월 선택 드롭다운 */}
      {showMonthSelector && (
        <div className="absolute top-16 left-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="grid grid-cols-3 gap-1 p-2">
            {monthNames.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`p-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                  index === currentDate.getMonth()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-700"
                }`}
                type="button"
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div
            key={day}
            className={`h-10 flex items-center justify-center text-sm font-medium ${
              index === 0
                ? "text-red-500"
                : index === 6
                ? "text-blue-500"
                : "text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="h-10 flex items-center justify-center">
            {date && (
              <button
                onClick={() => handleDateClick(date)}
                disabled={isDateDisabled(date)}
                className={`
                  w-10 h-10 text-sm rounded-full transition-all duration-200 font-medium
                  ${
                    isDateDisabled(date)
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-900 hover:bg-gray-100 hover:scale-105"
                  }
                  ${
                    isDateSelected(date)
                      ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                      : ""
                  }
                  ${
                    isDateInRange(date) && !isDateSelected(date)
                      ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                      : ""
                  }
                  ${
                    date.getDay() === 0 &&
                    !isDateSelected(date) &&
                    !isDateInRange(date)
                      ? "text-red-500"
                      : ""
                  }
                  ${
                    date.getDay() === 6 &&
                    !isDateSelected(date) &&
                    !isDateInRange(date)
                      ? "text-blue-500"
                      : ""
                  }
                `}
                type="button"
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 범위 선택 안내 메시지 */}
      {isRange && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          {!rangeStart && !rangeEnd && "시작일을 선택하세요"}
          {rangeStart && !rangeEnd && "종료일을 선택하세요"}
          {rangeStart && rangeEnd && "날짜 범위가 선택되었습니다"}
        </div>
      )}

      {/* 드롭다운 외부 클릭 시 닫기 */}
      {(showYearSelector || showMonthSelector) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowYearSelector(false);
            setShowMonthSelector(false);
          }}
        />
      )}
    </div>
  );
};
