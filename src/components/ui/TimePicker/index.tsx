import { TimePicker } from "./TimePicker";
import { TimeSelector } from "./TimeSelector";

// Composite Component 패턴
const TimePickerComponent = Object.assign(TimePicker, {
  Selector: TimeSelector,
});

export { TimePickerComponent as TimePicker };
export type {
  TimePickerProps,
  TimeSelectorProps,
  TimeValue,
  TimeFormat,
  PeriodType,
} from "./types";
