// src/components/ui/Radio/index.tsx
import { RadioGroup } from "./RadioGroup";
import { RadioItem } from "./RadioItem";

// Composite Component 패턴
const Radio = Object.assign(RadioItem, {
  Group: RadioGroup,
  Item: RadioItem,
});

export { Radio };
export type { RadioProps, RadioGroupProps } from "./types";
