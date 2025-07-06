// src/components/layout/Footer/FooterContact.tsx
"use client";

import React from "react";
import { FooterContactProps } from "./types";

const FooterContact: React.FC<FooterContactProps> = ({
  children,
  className = "",
}) => {
  return <div className={`footer-contact ${className}`}>{children}</div>;
};

FooterContact.displayName = "Footer.Contact";

export { FooterContact };
