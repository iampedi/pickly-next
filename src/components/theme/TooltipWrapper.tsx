// src/components/theme/TooltipWrapper.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: React.ReactNode;
  tooltip: React.ReactNode;
}

export default function TooltipWrapper({
  children,
  tooltip,
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent sideOffset={5}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
