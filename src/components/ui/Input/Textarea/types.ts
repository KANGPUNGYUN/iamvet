export type TextareaState =
  | "untouched"
  | "hover"
  | "focus"
  | "typing"
  | "filled"
  | "disabled"
  | "default";

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  rows?: number;
  cols?: number;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  state?: TextareaState;
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export interface TextareaGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  className?: string;
  children: React.ReactNode;
}
