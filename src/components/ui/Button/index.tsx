// src/components/ui/Button/index.tsx
import { ButtonRoot } from "./ButtonRoot";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonText } from "./ButtonText";
import { ButtonGroup } from "./ButtonGroup";

// Composite Component 패턴
const Button = Object.assign(ButtonRoot, {
  Icon: ButtonIcon,
  Text: ButtonText,
  Group: ButtonGroup,
});

export { Button };
export type { ButtonProps, ButtonIconProps, ButtonTextProps } from "./types";
