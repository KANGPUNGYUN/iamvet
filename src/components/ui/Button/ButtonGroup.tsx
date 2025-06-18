// src/components/ui/Button/ButtonGroup.tsx
import React from "react";

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "small" | "medium" | "large";
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = "",
  orientation = "horizontal",
  spacing = "medium",
}) => {
  return (
    <div
      className={`button-group ${className}`}
      data-orientation={orientation}
      data-spacing={spacing}
    >
      {children}
    </div>
  );
};

ButtonGroup.displayName = "Button.Group";

export { ButtonGroup };
