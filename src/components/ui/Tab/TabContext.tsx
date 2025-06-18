// src/components/ui/Tab/TabContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { TabVariant } from "./types";

interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  variant: TabVariant;
  onTabChange?: (value: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("Tab components must be used within Tab.Container");
  }
  return context;
};

export { TabContext };
