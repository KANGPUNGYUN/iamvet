// src/components/ui/Tab/index.tsx
import { TabContainer } from "./TabContainer";
import { TabList } from "./TabList";
import { TabItem } from "./TabItem";
import { TabContent } from "./TabContent";

// Composite Component 패턴
const Tab = Object.assign(TabContainer, {
  List: TabList,
  Item: TabItem,
  Content: TabContent,
});

export { Tab };
export type {
  TabContainerProps,
  TabListProps,
  TabItemProps,
  TabContentProps,
  TabVariant,
} from "./types";
