export type InputBoxState =
  | "default" // 기본 상태
  | "hover" // 호버 상태
  | "focus" // 클릭(탭) 상태
  | "typing" // 작성중 상태
  | "filled" // 작성된 상태(조회상태)
  | "disabled" // disable 상태
  | "untouched"; // 클릭하지 않은 상태

export type InputBoxType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search";

export interface InputBoxGuideProps {
  text?: string;
  type?: "info" | "success" | "warning" | "error";
  className?: string;
}

export interface InputBoxProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
  onClear?: () => void;
  placeholder?: string;
  type?: InputBoxType;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
  state?: InputBoxState;
  suffix?: string;
  guide?: InputBoxGuideProps;
  className?: string;
  children?: React.ReactNode;
  // 중복확인 버튼 관련 props
  duplicateCheck?: {
    buttonText: string;
    onCheck: () => void;
    isChecking?: boolean;
    isValid?: boolean;
  };
}

export interface InputBoxGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  guide?: InputBoxGuideProps;
  className?: string;
  children: React.ReactNode;
}
