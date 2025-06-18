// src/components/ui/FilterBox/FilterBoxGroup.tsx
"use client";

import React, { useState } from "react";
import { FilterBoxGroupProps } from "./types";
import { FilterBoxContext } from "./FilterBoxContext";

const FilterBoxGroup: React.FC<FilterBoxGroupProps> = ({
  value: controlledValue,
  defaultValue = [],
  children,
  orientation = "horizontal",
  disabled = false,
  className = "",
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (itemValue: string, active: boolean) => {
    if (!disabled) {
      let newValue: string[];

      if (active) {
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
    <FilterBoxContext.Provider
      value={{ value, onChange: handleChange, disabled }}
    >
      <div
        className={`filter-box-group ${className}`}
        role="group"
        data-orientation={orientation}
        data-disabled={disabled}
        style={{
          display: "flex",
          flexDirection: orientation === "vertical" ? "column" : "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {children}
      </div>
    </FilterBoxContext.Provider>
  );
};

FilterBoxGroup.displayName = "FilterBox.Group";

export { FilterBoxGroup };
