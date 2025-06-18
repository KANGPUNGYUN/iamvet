// src/components/ui/Tab/types.ts
export type TabVariant = "default" | "rounded" | "filled";

export interface TabContainerProps {
  children: React.ReactNode;
  defaultTab?: string;
  variant?: TabVariant;
  className?: string;
  onTabChange?: (value: string) => void;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}
