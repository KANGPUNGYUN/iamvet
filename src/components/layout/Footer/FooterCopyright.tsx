// src/components/layout/Footer/FooterCopyright.tsx
"use client";

import React from "react";
import { FooterCopyrightProps } from "./types";

const FooterCopyright: React.FC<FooterCopyrightProps> = ({
  children,
  className = "",
}) => {
  return <div className={`footer-copyright ${className}`}>{children}</div>;
};

FooterCopyright.displayName = "Footer.Copyright";

export { FooterCopyright };
