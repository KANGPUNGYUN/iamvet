export type TimeFormat = "12h" | "24h";
export type PeriodType = "AM" | "PM";

export interface TimeValue {
  hour: number;
  minute: number;
  period?: PeriodType; // 12시간 형식일 때만 사용
}

export interface TimePickerProps {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onChange?: (time: TimeValue) => void;
  placeholder?: string;
  format?: TimeFormat;
  minuteStep?: number; // 분 단위 (기본값: 10)
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface TimeSelectorProps {
  value?: TimeValue;
  onChange?: (time: TimeValue) => void;
  format?: TimeFormat;
  minuteStep?: number;
  onClose?: () => void;
  className?: string;
}
