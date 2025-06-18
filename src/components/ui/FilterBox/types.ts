// src/components/ui/FilterBox/types.ts
export interface FilterBoxProps {
  value?: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (active: boolean, value?: string) => void;
}

export interface FilterBoxGroupProps {
  value?: string[];
  defaultValue?: string[];
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
  onChange?: (values: string[]) => void;
}
