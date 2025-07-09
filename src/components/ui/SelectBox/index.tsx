import { SelectBoxGroup } from "./SelectBoxGroup";
import { SelectBoxItem } from "./SelectBoxItem";
import { SelectBoxOption } from "./SelectBoxOption";

// Composite Component 패턴
const SelectBox = Object.assign(SelectBoxItem, {
  Group: SelectBoxGroup,
  Item: SelectBoxItem,
  Option: SelectBoxOption,
});

export { SelectBox };
export type { SelectBoxProps, SelectBoxGroupProps, SelectBoxOptionProps, SelectBoxState, SelectBoxOption as SelectBoxOptionType } from "./types";