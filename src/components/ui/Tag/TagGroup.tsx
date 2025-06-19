// src/components/ui/Tag/TagGroup.tsx
"use client";

import React from "react";
import { TagGroupProps } from "./types";
import { TagContext } from "./TagContext";

const TagGroup: React.FC<TagGroupProps> = ({
  children,
  gap = "8px",
  className = "",
  orientation = "horizontal",
}) => {
  const containerStyle = {
    display: "flex",
    flexDirection:
      orientation === "horizontal" ? ("row" as const) : ("column" as const),
    gap: typeof gap === "number" ? `${gap}px` : gap,
    flexWrap:
      orientation === "horizontal" ? ("wrap" as const) : ("nowrap" as const),
  };

  return (
    <TagContext.Provider value={{ gap, orientation }}>
      <div
        className={`tag-group ${className}`}
        data-orientation={orientation}
        style={containerStyle}
      >
        {children}
      </div>
    </TagContext.Provider>
  );
};

TagGroup.displayName = "Tag.Group";

export { TagGroup };
