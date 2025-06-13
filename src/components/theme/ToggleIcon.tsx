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
          size={24}
          weight="duotone"
          className={cn(active ? "text-rose-600" : "text-gray-400")}
        />
      </span>
    </TooltipWrapper>
  );
}
