import React, { useState } from "react";
import { TextareaContext } from "./TextareaContext";
import { TextareaGroupProps } from "./types";

export const TextareaGroup: React.FC<TextareaGroupProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  disabled = false,
  error = false,
  success = false,
  className,
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (!disabled) {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  const contextValue = {
    value,
    onChange: handleChange,
    disabled,
    error,
    success,
  };

  return (
    <TextareaContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TextareaContext.Provider>
  );
};
