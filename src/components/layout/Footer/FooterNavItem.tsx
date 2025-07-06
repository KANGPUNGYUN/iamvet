// src/components/layout/Footer/FooterNavItem.tsx
"use client";

import React, { useState } from "react";
import { FooterNavItemProps } from "./types";

const FooterNavItem: React.FC<FooterNavItemProps> = ({
  children,
  href,
  onClick,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else if (href) {
        window.location.href = href;
      }
    }
  };

  if (href) {
    return (
      <a
        href={href}
        className={`footer-nav-item ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`footer-nav-item ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

FooterNavItem.displayName = "Footer.NavItem";

export { FooterNavItem };
