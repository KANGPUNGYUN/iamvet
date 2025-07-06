// src/components/layout/Footer/FooterNav.tsx
"use client";

import React from "react";
import { FooterNavProps } from "./types";

const FooterNav: React.FC<FooterNavProps> = ({ children, className = "" }) => {
  return <nav className={`footer-nav ${className}`}>{children}</nav>;
};

FooterNav.displayName = "Footer.Nav";

export { FooterNav };
