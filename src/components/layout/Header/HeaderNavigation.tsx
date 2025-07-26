"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeaderNavigationProps } from "./types";

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  items,
  className = "",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav className={`flex gap-[26px] items-center ${className}`}>
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const isActive = item.active;
        const shouldShowLine = isHovered || isActive;

        return (
          <Link
            key={index}
            href={item.href}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
              color:
                isHovered || isActive
                  ? "var(--Keycolor1, #FF8796)"
                  : "var(--text-default, #35313C)",
              textAlign: "center",
              fontFamily: "SUIT",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: "500",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {item.label}
            <div
              style={{
                position: "absolute",
                bottom: "-3px",
                left: shouldShowLine ? "0" : "50%",
                width: shouldShowLine ? "100%" : "0",
                height: "1px",
                background: "var(--Keycolor1, #FF8796)",
                transition: "width 0.3s ease, left 0.3s ease",
              }}
            />
          </Link>
        );
      })}
    </nav>
  );
};
