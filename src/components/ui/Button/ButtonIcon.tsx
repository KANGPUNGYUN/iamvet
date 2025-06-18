// src/components/ui/Button/ButtonIcon.tsx
import React from "react";
import { ButtonIconProps } from "./types";

const ButtonIcon: React.FC<ButtonIconProps> = ({
  children,
  className = "",
}) => {
  return <span className={`button-icon-only ${className}`}>{children}</span>;
};

ButtonIcon.displayName = "Button.Icon";

export { ButtonIcon };
