// src/components/ui/Checkbox/index.tsx
import { CheckboxGroup } from "./CheckboxGroup";
import { CheckboxItem } from "./CheckboxItem";

// Composite Component 패턴
const Checkbox = Object.assign(CheckboxItem, {
  Group: CheckboxGroup,
  Item: CheckboxItem,
});

export { Checkbox };
export type { CheckboxProps, CheckboxGroupProps } from "./types";
