// src/components/ui/FilterBox/FilterBoxContext.tsx
"use client";

import React, { createContext, useContext } from "react";

interface FilterBoxContextType {
  value: string[];
  onChange: (value: string, active: boolean) => void;
  disabled?: boolean;
}

const FilterBoxContext = createContext<FilterBoxContextType | undefined>(
  undefined
);

export const useFilterBoxContext = () => {
  const context = useContext(FilterBoxContext);
  return context; // FilterBox는 Group 없이도 사용 가능
};

export { FilterBoxContext };
