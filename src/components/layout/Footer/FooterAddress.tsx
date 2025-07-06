// src/components/layout/Footer/FooterAddress.tsx
"use client";

import React from "react";
import { FooterAddressProps } from "./types";

const FooterAddress: React.FC<FooterAddressProps> = ({
  children,
  className = "",
}) => {
  return <div className={`footer-address ${className}`}>{children}</div>;
};

FooterAddress.displayName = "Footer.Address";

export { FooterAddress };
