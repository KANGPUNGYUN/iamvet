import { DatePicker } from "./DatePicker";
import { DateRangePicker } from "./DateRangePicker";
import { Calendar } from "./Calendar";

// Composite Component 패턴
const DatePickerComponent = Object.assign(DatePicker, {
  Range: DateRangePicker,
  Calendar: Calendar,
});

export { DatePickerComponent as DatePicker };
export type { DatePickerProps, DateRangePickerProps, CalendarProps } from "./types";