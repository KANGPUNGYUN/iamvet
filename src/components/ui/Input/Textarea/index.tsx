import { TextareaGroup } from "./TextareaGroup";
import { TextareaItem } from "./TextareaItem";

// Composite Component 패턴
const Textarea = Object.assign(TextareaItem, {
  Group: TextareaGroup,
  Item: TextareaItem,
});

export { Textarea };
export type { TextareaProps, TextareaGroupProps } from "./types";