import React from "react";
import { InputBoxGuideProps } from "./types";

export const InputBoxGuide: React.FC<InputBoxGuideProps> = ({
  text,
  type = "info",
  className = "",
}) => {
  if (!text) return null;

  const typeClasses = {
    info: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  const iconClasses = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className={`mt-1 text-sm flex items-center gap-1 ${typeClasses[type]} ${className}`}>
      <span className="text-xs">{iconClasses[type]}</span>
      <span>{text}</span>
    </div>
  );
};