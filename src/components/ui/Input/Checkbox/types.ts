// src/components/ui/Checkbox/types.ts
export interface CheckboxProps {
  value?: string;
  children: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (checked: boolean, value?: string) => void;
}

export interface CheckboxGroupProps {
  value?: string[];
  defaultValue?: string[];
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
  onChange?: (values: string[]) => void;
}
