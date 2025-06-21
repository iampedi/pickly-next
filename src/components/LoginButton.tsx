// src/components/LoginButton.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// UI Imports
import { Button } from "@/components/theme/button";
import { LockSimpleIcon } from "@phosphor-icons/react/dist/ssr";

type LoginButtonProps = {
  className?: string;
};

export const LoginButton = ({ className }: LoginButtonProps) => {
  const { user } = useAuth();

  if (user) {
    return;
  }

  return (
    <Button className={className} variant="outline" asChild>
      <Link href="/auth/login" className="flex items-center gap-2">
        <LockSimpleIcon />
        Login
      </Link>
    </Button>
  );
};
