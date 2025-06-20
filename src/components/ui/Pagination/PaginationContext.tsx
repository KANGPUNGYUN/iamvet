// src/components/ui/Pagination/PaginationContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { PaginationContextType } from "./types";

const PaginationContext = createContext<PaginationContextType | undefined>(
  undefined
);

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  return context;
};

export { PaginationContext };
