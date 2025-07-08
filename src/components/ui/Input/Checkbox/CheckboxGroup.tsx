// src/components/ui/Checkbox/CheckboxGroup.tsx
"use client";

import React, { useState } from "react";
import { CheckboxGroupProps } from "./types";
import { CheckboxContext } from "./CheckboxContext";

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value: controlledValue,
  defaultValue = [],
  children,
  orientation = "vertical",
  disabled = false,
  className = "",
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (itemValue: string, checked: boolean) => {
    if (!disabled) {
      let newValue: string[];

      if (checked) {
        newValue = [...value, itemValue];
      } else {
        newValue = value.filter((v) => v !== itemValue);
      }

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  return (
    <CheckboxContext.Provider
      value={{ value, onChange: handleChange, disabled }}
    >
      <div
        className={`checkbox-group ${className}`}
        role="group"
        data-orientation={orientation}
        data-disabled={disabled}
      >
        {children}
      </div>
    </CheckboxContext.Provider>
  );
};

CheckboxGroup.displayName = "Checkbox.Group";

export { CheckboxGroup };
