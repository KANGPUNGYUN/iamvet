// src/components/layout/Footer/Footer.tsx
"use client";

import React from "react";
import { FooterProps } from "./types";

const Footer: React.FC<FooterProps> = ({ children, className = "" }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-container">{children}</div>
    </footer>
  );
};

Footer.displayName = "Footer";

export { Footer };
