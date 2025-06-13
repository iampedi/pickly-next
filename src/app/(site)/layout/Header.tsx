// src/app/(site)/layout/Header.tsx
import Link from "next/link";

// UI Imports
import { AuthButton } from "@/components/AuthButton";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/theme/Button";

export const Header = () => {
  return (
    <header>
      <div className="continer mx-auto h-full max-w-5xl px-4">
        <div className="flex items-center justify-between py-5">
          <Logo />

          <div className="flex items-center gap-2.5">
            <Button variant="link" asChild>
              <Link href="/explore">Explore</Link>
            </Button>

            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
