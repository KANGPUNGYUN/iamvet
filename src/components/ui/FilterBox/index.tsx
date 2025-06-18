// src/components/ui/FilterBox/index.tsx
import { FilterBoxGroup } from "./FilterBoxGroup";
import { FilterBoxItem } from "./FilterBoxItem";

// Composite Component 패턴
const FilterBox = Object.assign(FilterBoxItem, {
  Group: FilterBoxGroup,
  Item: FilterBoxItem,
});

export { FilterBox };
export type { FilterBoxProps, FilterBoxGroupProps } from "./types";
