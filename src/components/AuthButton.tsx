// src/components/AuthButton.tsx
"use client";

import Link from "next/link";
import { Button } from "./theme/Button";
import { LockSimpleIcon, UserCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/contexts/AuthContext";

type AuthButtonProps = {
  className?: string;
};

export const AuthButton = ({ className }: AuthButtonProps) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  const iconClass = "w-5 h-5";

  return (
    <Button className={className} variant="outline" asChild>
      <Link
        href={user ? "/panel" : "/auth/login"}
        className="flex items-center gap-2"
      >
        {user ? (
          <>
            <UserCircleIcon className={iconClass} />
            Panel
          </>
        ) : (
          <>
            <LockSimpleIcon className={iconClass} />
            Login
          </>
        )}
      </Link>
    </Button>
  );
};
