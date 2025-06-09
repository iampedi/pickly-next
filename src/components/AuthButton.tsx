// src/components/AuthButton.tsx
import Link from "next/link";
import { Button } from "./theme/Button";
import { CircleUserRoundIcon } from "lucide-react";

type AuthButtonProps = {
  className?: string;
};

export const AuthButton = ({ className }: AuthButtonProps) => {
  return (
    <Button className={className} variant={"outline"} size={"lg"} asChild>
      <Link href="/auth/login">
        <CircleUserRoundIcon />
        Login
      </Link>
    </Button>
  );
};
