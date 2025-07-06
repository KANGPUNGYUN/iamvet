// src/components/layout/Footer/FooterContentWrap.tsx
"use client";

import React from "react";
import { FooterContentWrapProps } from "./types";

const FooterContentWrap: React.FC<FooterContentWrapProps> = ({
  children,
  className = "",
}) => {
  return <div className={`footer-contentwrap ${className}`}>{children}</div>;
};

FooterContentWrap.displayName = "Footer.ContentWrap";

export { FooterContentWrap };
