// src/components/ui/Tab/TabItem.tsx
"use client";

import React from "react";
import { TabItemProps } from "./types";
import { useTabContext } from "./TabContext";

const TabItem: React.FC<TabItemProps> = ({
  value,
  children,
  className = "",
  disabled = false,
  onClick,
}) => {
  const { activeTab, setActiveTab, variant } = useTabContext();
  const isActive = activeTab === value;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
      onClick?.();
    }
  };

  const getTabItemClass = () => {
    return `tab-item tab-item-${variant} ${
      variant !== "rounded" && "font-title title-light"
    }`;
  };

  return (
    <button
      className={`${getTabItemClass()} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      data-active={isActive}
      data-variant={variant}
    >
      {children}
    </button>
  );
};

TabItem.displayName = "Tab.Item";

export { TabItem };
