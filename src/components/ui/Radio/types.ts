// src/components/ui/Radio/types.ts
export interface RadioProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}
