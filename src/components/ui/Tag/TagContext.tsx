// src/components/ui/Tag/TagContext.tsx
"use client";

import React, { createContext, useContext } from "react";

interface TagContextType {
  gap?: number | string;
  orientation?: "horizontal" | "vertical";
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export const useTagContext = () => {
  const context = useContext(TagContext);
  return context; // Tag는 Group 없이도 사용 가능
};

export { TagContext };
