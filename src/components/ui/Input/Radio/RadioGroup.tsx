// src/components/ui/Radio/RadioGroup.tsx
"use client";

import React, { useState } from "react";
import { RadioGroupProps } from "./types";
import { RadioContext } from "./RadioContext";

const RadioGroup: React.FC<RadioGroupProps> = ({
  value: controlledValue,
  defaultValue = "",
  children,
  orientation = "vertical",
  disabled = false,
  className = "",
  onChange,
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

  return (
    <RadioContext.Provider value={{ value, onChange: handleChange, disabled }}>
      <div
        className={`radio-group ${className}`}
        role="radiogroup"
        data-orientation={orientation}
        data-disabled={disabled}
      >
        {children}
      </div>
    </RadioContext.Provider>
  );
};

RadioGroup.displayName = "Radio.Group";

export { RadioGroup };
