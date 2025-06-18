// src/components/ui/Tab/TabContainer.tsx
"use client";

import React, { useState } from "react";
import { TabContainerProps } from "./types";
import { TabContext } from "./TabContext";

const TabContainer: React.FC<TabContainerProps> = ({
  children,
  defaultTab = "",
  variant = "default",
  className = "",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <TabContext.Provider
      value={{
        activeTab,
        setActiveTab: handleTabChange,
        variant,
        onTabChange,
      }}
    >
      <div className={`tab-base tab-container ${className}`}>{children}</div>
    </TabContext.Provider>
  );
};

TabContainer.displayName = "Tab.Container";

export { TabContainer };
