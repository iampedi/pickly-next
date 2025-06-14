// src/components/theme/NavLink.tsx
"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";

export function NavLink({
  href,
  children,
  onClick,
  variant,
  size,
  exact = true,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?:
    | "menu"
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "panel";
  size?: "default" | "sm" | "lg" | "icon" | "menu" | "link";
  exact?: boolean;
  className?: string;
  activeClass?: string;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Button
      className={cn(className)}
      variant={variant}
      size={size}
      active={isActive && true}
      asChild
      onClick={onClick}
    >
      <Link href={href} {...props}>
        {children}
      </Link>
    </Button>
  );
}
