export type SelectBoxState = 
  | 'default'      // 기본 상태
  | 'hover'        // 호버 상태
  | 'open';        // 클릭된 상태 (드롭다운 열림)

export interface SelectBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectBoxProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: SelectBoxOption[];
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  state?: SelectBoxState;
  className?: string;
  children?: React.ReactNode;
}

export interface SelectBoxGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface SelectBoxOptionProps {
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: (value: string) => void;
  className?: string;
}