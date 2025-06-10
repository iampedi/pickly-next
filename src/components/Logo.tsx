// src/components/Logo.tsx
import { cn } from "@/lib/utils";
import Link from "next/link";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-start", className)}>
      <Link href={"/"}>
        <h1 className="bg-lime-200 text-3xl font-bold uppercase">Pickly ::</h1>
      </Link>
    </div>
  );
};
