// src/components/layout/Footer/FooterLogo.tsx
"use client";

import React from "react";
import { FooterLogoProps } from "./types";

const FooterLogo: React.FC<FooterLogoProps> = ({
  src,
  alt = "Logo",
  children,
  className = "",
}) => {
  return (
    <div className={`footer-logo ${className}`}>
      {src ? <img src={src} alt={alt} /> : children}
    </div>
  );
};

FooterLogo.displayName = "Footer.Logo";

export { FooterLogo };
