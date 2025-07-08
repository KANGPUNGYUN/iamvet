import React, { useState } from "react";
import { InputBoxContext } from "./InputBoxContext";
import { InputBoxGroupProps } from "./types";

export const InputBoxGroup: React.FC<InputBoxGroupProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  disabled = false,
  error = false,
  success = false,
  guide,
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
    guide,
  };

  return (
    <InputBoxContext.Provider value={contextValue}>
      <div className={className}>
        {children}
      </div>
    </InputBoxContext.Provider>
  );
};