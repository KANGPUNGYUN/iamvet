export type SearchBarState = 
  | 'default'      // 기본 상태
  | 'hover'        // 호버 상태
  | 'focus';       // 클릭된 상태

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  state?: SearchBarState;
  showSearchIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}