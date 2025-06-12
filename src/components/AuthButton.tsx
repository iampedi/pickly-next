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

  return (
    <>
      {user ? (
        <Button className={className} variant="outline" asChild>
          <Link href="/panel" className="flex items-center gap-2">
            <UserCircleIcon />
            Panel
          </Link>
        </Button>
      ) : (
        <Button className={className} variant="outline" asChild>
          <Link href="/auth/login" className="flex items-center gap-2">
            <LockSimpleIcon />
            Login
          </Link>
        </Button>
      )}
    </>
  );
};
