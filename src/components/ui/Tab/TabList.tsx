// src/components/ui/Tab/TabList.tsx
"use client";

import React from "react";
import { TabListProps } from "./types";
import { useTabContext } from "./TabContext";

const TabList: React.FC<TabListProps> = ({ children, className = "" }) => {
  const { variant } = useTabContext();

  const getTabListClass = () => {
    return `tab-list tab-list-${variant}`;
  };

  return (
    <div className={`${getTabListClass()} ${className}`} role="tablist">
      {children}
    </div>
  );
};

TabList.displayName = "Tab.List";

export { TabList };
