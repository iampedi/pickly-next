// src/components/AuthButton.tsx
import Link from "next/link";
import { Button } from "./theme/Button";
import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr";

type AuthButtonProps = {
  className?: string;
};

export const AuthButton = ({ className }: AuthButtonProps) => {
  return (
    <Button className={className} variant={"outline"} asChild>
      <Link href="/auth/login">
        <UserCircleIcon />
        Login
      </Link>
    </Button>
  );
};
