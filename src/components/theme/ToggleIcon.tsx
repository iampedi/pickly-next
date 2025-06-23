// src/components/theme/ToggleIcon
"use client";

import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import { TooltipWrapper } from "./TooltipWrapper";
import { cn } from "@/lib/utils";

export type ToggleIconProp = {
  icon?: React.ElementType;
  tooltip?: string;
  active?: boolean;
  onClick?: () => void;
};

export function ToggleIcon({
  icon: Icon = StarIcon,
  tooltip,
  active,
  onClick,
}: ToggleIconProp) {
  return (
    <TooltipWrapper tooltip={tooltip || ""}>
      <span onClick={onClick} className="cursor-pointer transition-colors">
        <Icon
          weight="duotone"
          className={cn("size-5.5 md:size-6", active ? "text-rose-600" : "text-gray-500/80")}
        />
      </span>
    </TooltipWrapper>
  );
}
