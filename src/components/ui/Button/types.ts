// src/components/ui/Button/types.ts
export type ButtonVariant =
  | "default" // 기본 회색 배경
  | "keycolor" // 키컬러 배경
  | "line" // 테두리만 있는 스타일
  | "weak" // 약한 스타일 (XS만)
  | "text" // 텍스트만 있고 밑줄 스타일
  | "disable"; // 비활성화

export type ButtonSize = "large" | "medium" | "small" | "xsmall";

export type ButtonType =
  | "normal" // 일반 버튼
  | "icon-web" // 웹용 아이콘 버튼
  | "icon-app" // 앱용 아이콘 버튼
  | "more"; // 더보기 버튼

export type ButtonDevice = "web" | "app";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  buttonType?: ButtonType;
  device?: ButtonDevice;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
  asChild?: boolean;
  fullWidth?: boolean; // 모바일에서 100% 너비 유지 옵션
}

export interface ButtonIconProps {
  children: React.ReactNode;
  className?: string;
}

export interface ButtonTextProps {
  children: React.ReactNode;
  className?: string;
}
