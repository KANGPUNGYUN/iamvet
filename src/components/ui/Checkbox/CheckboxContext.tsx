// src/components/ui/Checkbox/CheckboxContext.tsx
"use client";

import React, { createContext, useContext } from "react";

interface CheckboxContextType {
  value: string[];
  onChange: (value: string, checked: boolean) => void;
  disabled?: boolean;
}

const CheckboxContext = createContext<CheckboxContextType | undefined>(
  undefined
);

export const useCheckboxContext = () => {
  const context = useContext(CheckboxContext);
  return context; // Checkbox는 Group 없이도 사용 가능
};

export { CheckboxContext };
