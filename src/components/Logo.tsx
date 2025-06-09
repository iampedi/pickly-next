// src/components/Logo.tsx
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <h1 className="bg-lime-200 text-3xl font-bold uppercase">Pickly ::</h1>
    </div>
  );
};
