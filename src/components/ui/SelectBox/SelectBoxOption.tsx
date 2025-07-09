import React from "react";
import { SelectBoxOptionProps } from "./types";

export const SelectBoxOption: React.FC<SelectBoxOptionProps> = ({
  value,
  label,
  disabled = false,
  selected = false,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(value);
    }
  };

  const baseClasses = "px-3 py-2 cursor-pointer transition-colors duration-200";
  const stateClasses = [
    disabled && "text-gray-400 cursor-not-allowed",
    !disabled && selected && "bg-blue-100 text-blue-900",
    !disabled && !selected && "hover:bg-gray-100 text-gray-900",
  ].filter(Boolean).join(" ");

  return (
    <div
      onClick={handleClick}
      className={`${baseClasses} ${stateClasses} ${className}`}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
    >
      {label}
    </div>
  );
};