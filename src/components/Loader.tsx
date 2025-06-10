// src/components/theme/Loader.tsx
import { cn } from "@/lib/utils";
import { SpinnerGapIcon } from "@phosphor-icons/react/dist/ssr";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      className={cn("flex h-full items-center justify-center", className)}
      {...props}
    >
      <SpinnerGapIcon className="size-7 animate-spin" />
    </div>
  );
}
