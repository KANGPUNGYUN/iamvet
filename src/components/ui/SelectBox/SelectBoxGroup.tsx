import React, { useState } from "react";
import { SelectBoxContext } from "./SelectBoxContext";
import { SelectBoxGroupProps } from "./types";

export const SelectBoxGroup: React.FC<SelectBoxGroupProps> = ({
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
    <SelectBoxContext.Provider value={contextValue}>
      <div className={className}>
        {children}
      </div>
    </SelectBoxContext.Provider>
  );
};