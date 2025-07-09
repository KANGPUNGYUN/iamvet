export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  children?: React.ReactNode;
}

export interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  onChange?: (startDate: Date | null, endDate: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  children?: React.ReactNode;
}

export interface CalendarProps {
  value?: Date;
  startDate?: Date;
  endDate?: Date;
  onChange?: (date: Date) => void;
  onRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  isRange?: boolean;
  className?: string;
}
