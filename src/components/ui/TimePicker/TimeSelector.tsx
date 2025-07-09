import React, { useState, useEffect, useRef } from "react";
import { TimeSelectorProps, TimeValue, PeriodType } from "./types";

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  format = "12h",
  minuteStep = 1,
  onClose,
  className = "",
}) => {
  const [selectedTime, setSelectedTime] = useState<TimeValue>(
    value || { hour: format === "12h" ? 12 : 0, minute: 0, period: "AM" }
  );

  const periodRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedTime(value);
    }
  }, [value]);

  // 시간 옵션 생성
  const generateHourOptions = () => {
    const hours = [];
    if (format === "12h") {
      for (let i = 1; i <= 12; i++) {
        hours.push(i);
      }
    } else {
      for (let i = 0; i <= 23; i++) {
        hours.push(i);
      }
    }
    return hours;
  };

  // 분 옵션 생성
  const generateMinuteOptions = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += minuteStep) {
      minutes.push(i);
    }
    return minutes;
  };

  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();

  const handlePeriodChange = (period: PeriodType) => {
    const newTime = { ...selectedTime, period };
    setSelectedTime(newTime);
    onChange?.(newTime);
  };

  const handleHourChange = (hour: number) => {
    const newTime = { ...selectedTime, hour };
    setSelectedTime(newTime);
    onChange?.(newTime);
  };

  const handleMinuteChange = (minute: number) => {
    const newTime = { ...selectedTime, minute };
    setSelectedTime(newTime);
    onChange?.(newTime);
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const ScrollPicker = ({
    options,
    selectedValue,
    onSelect,
    formatValue,
    width = "60px",
  }: {
    options: (string | number)[];
    selectedValue: string | number;
    onSelect: (value: any) => void;
    formatValue?: (value: any) => string;
    width?: string;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // 선택된 값으로 스크롤 위치 조정
      if (containerRef.current) {
        const selectedIndex = options.findIndex(
          (option) => option === selectedValue
        );
        if (selectedIndex !== -1) {
          const itemHeight = 40;
          const scrollTop = selectedIndex * itemHeight - 80; // 중앙 정렬을 위해 조정
          containerRef.current.scrollTop = scrollTop;
        }
      }
    }, [selectedValue, options]);

    return (
      <div
        className="relative overflow-hidden"
        style={{ width, height: "200px" }}
      >
        <div
          ref={containerRef}
          className="h-full overflow-y-auto scrollbar-hide"
          style={{
            paddingTop: "80px",
            paddingBottom: "80px",
            scrollSnapType: "y mandatory",
          }}
        >
          {options.map((option, index) => (
            <div
              key={option}
              onClick={() => onSelect(option)}
              className="flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-50"
              style={{
                height: "40px",
                fontSize: "18px",
                fontWeight: selectedValue === option ? "600" : "400",
                color: selectedValue === option ? "#007AFF" : "#333",
                scrollSnapAlign: "center",
              }}
            >
              {formatValue ? formatValue(option) : option}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-white border border-gray-300 rounded-lg shadow-xl ${className}`}
      style={{
        width: "280px",
        padding: "20px",
      }}
    >
      <div className="flex items-center justify-center space-x-4">
        {/* AM/PM 선택 (12시간 형식일 때만) */}
        {format === "12h" && (
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-600 mb-2">AM/PM</div>
            <ScrollPicker
              options={["AM", "PM"]}
              selectedValue={selectedTime.period || "AM"}
              onSelect={handlePeriodChange}
              width="60px"
            />
          </div>
        )}

        {/* 시간 선택 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-600 mb-2">시</div>
          <ScrollPicker
            options={hourOptions}
            selectedValue={selectedTime.hour}
            onSelect={handleHourChange}
            formatValue={formatNumber}
            width="60px"
          />
        </div>

        {/* 분 선택 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-600 mb-2">분</div>
          <ScrollPicker
            options={minuteOptions}
            selectedValue={selectedTime.minute}
            onSelect={handleMinuteChange}
            formatValue={formatNumber}
            width="60px"
          />
        </div>
      </div>

      {/* 확인 버튼 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          type="button"
        >
          확인
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
