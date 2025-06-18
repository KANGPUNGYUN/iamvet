// src/components/ui/Button/ButtonText.tsx
import React from "react";
import { ButtonTextProps } from "./types";

const ButtonText: React.FC<ButtonTextProps> = ({
  children,
  className = "",
}) => {
  return <span className={`button-text-only ${className}`}>{children}</span>;
};

ButtonText.displayName = "Button.Text";

export { ButtonText };
