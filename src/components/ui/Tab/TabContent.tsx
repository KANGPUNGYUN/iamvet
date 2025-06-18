// src/components/ui/Tab/TabContent.tsx
"use client";

import React from "react";
import { TabContentProps } from "./types";
import { useTabContext } from "./TabContext";

const TabContent: React.FC<TabContentProps> = ({
  value,
  children,
  className = "",
}) => {
  const { activeTab, variant } = useTabContext();
  const isActive = activeTab === value;

  const getContentClass = () => {
    let baseClass = "tab-content";

    // variant별 클래스 추가
    if (variant === "rounded") {
      baseClass += " tab-content-rounded";
    } else {
      baseClass += ` tab-content-${variant}`;
    }

    return baseClass;
  };

  return (
    <div
      className={`${getContentClass()} ${className}`}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      data-hidden={!isActive}
    >
      {isActive && children}
    </div>
  );
};

TabContent.displayName = "Tab.Content";

export { TabContent };
