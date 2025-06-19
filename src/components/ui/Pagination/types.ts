// src/components/ui/Pagination/types.ts
export type PaginationButtonState = "active" | "default" | "hover" | "disabled";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisiblePages?: number;
}

export interface PaginationButtonProps {
  children: React.ReactNode;
  state?: PaginationButtonState;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface PaginationContextType {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
