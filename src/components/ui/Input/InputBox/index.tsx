import { InputBoxGroup } from "./InputBoxGroup";
import { InputBoxItem } from "./InputBoxItem";
import { InputBoxGuide } from "./InputBoxGuide";

// Composite Component 패턴
const InputBox = Object.assign(InputBoxItem, {
  Group: InputBoxGroup,
  Item: InputBoxItem,
  Guide: InputBoxGuide,
});

export { InputBox };
export type { InputBoxProps, InputBoxGroupProps, InputBoxGuideProps, InputBoxState, InputBoxType, InputBoxVariant } from "./types";