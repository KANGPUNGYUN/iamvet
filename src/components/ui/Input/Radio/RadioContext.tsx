// src/components/ui/Radio/RadioContext.tsx
"use client";

import React, { createContext, useContext } from "react";

interface RadioContextType {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const useRadioContext = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("Radio components must be used within Radio.Group");
  }
  return context;
};

export { RadioContext };
