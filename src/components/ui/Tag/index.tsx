// src/components/ui/Tag/index.tsx
import { TagGroup } from "./TagGroup";
import { TagItem } from "./TagItem";

// Composite Component 패턴
const Tag = Object.assign(TagItem, {
  Group: TagGroup,
  Item: TagItem,
});

export { Tag };
export type { TagProps, TagGroupProps } from "./types";
