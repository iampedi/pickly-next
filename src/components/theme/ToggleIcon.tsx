// src/components/theme/ToggleIcon
"use client";
import { BookmarkIcon } from "@phosphor-icons/react/dist/ssr";
import { TooltipWrapper } from "./TooltipWrapper";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ToggleIconProp = {
  icon?: React.ElementType;
  tooltip?: string;
};

export function ToggleIcon({ icon, tooltip }: ToggleIconProp) {
  const [active, setActive] = useState(false);
  const Icon = icon || BookmarkIcon;

  return (
    <TooltipWrapper tooltip={tooltip || ""}>
      <Icon
        size={24}
        weight="duotone"
        className={cn(
          "cursor-pointer transition-colors",
          active ? "text-rose-600" : "text-gray-400",
        )}
        onClick={() => setActive((prev) => !prev)}
      />
    </TooltipWrapper>
  );
}
