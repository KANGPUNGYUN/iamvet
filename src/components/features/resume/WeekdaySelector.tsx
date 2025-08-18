"use client";

import React from "react";

interface WeekdaySelectorProps {
  value?: string[];
  onChange?: (days: string[]) => void;
  disabled?: boolean;
  className?: string;
}

const WEEKDAYS = [
  { value: "monday", label: "월" },
  { value: "tuesday", label: "화" },
  { value: "wednesday", label: "수" },
  { value: "thursday", label: "목" },
  { value: "friday", label: "금" },
  { value: "saturday", label: "토" },
  { value: "sunday", label: "일" },
];

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  value = [],
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleDayToggle = (dayValue: string) => {
    if (disabled) return;

    const newSelectedDays = value.includes(dayValue)
      ? value.filter((day) => day !== dayValue)
      : [...value, dayValue];

    onChange?.(newSelectedDays);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {WEEKDAYS.map(({ value: dayValue, label }) => {
        const isSelected = value.includes(dayValue);

        return (
          <button
            key={dayValue}
            type="button"
            onClick={() => handleDayToggle(dayValue)}
            disabled={disabled}
            className={`
              w-[40px] h-[40px] rounded-full border border-gray-200 
              flex items-center justify-center text-sm font-medium
              transition-all duration-200
              ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-gray-300"
              }
              ${isSelected ? "text-white" : "text-gray-700 bg-white"}
            `}
            style={{
              backgroundColor: isSelected ? "#FF8796" : "white",
              borderColor: isSelected ? "#FF8796" : "#E5E5E5",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
