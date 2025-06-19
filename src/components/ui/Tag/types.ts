// src/components/ui/Tag/types.ts
export type TagVariant = 1 | 2 | 3 | 4 | 5 | 6;

export interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface TagGroupProps {
  children: React.ReactNode;
  gap?: number | string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}
