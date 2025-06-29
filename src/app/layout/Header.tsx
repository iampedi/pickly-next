// src/app/(site)/layout/Header.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

// UI Imports
import { Logo } from "@/components/Logo";
import { UserAvatar } from "@/components/UserAvatar";
import { NavLink } from "@/components/theme/NavLink";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import { MobileMenu } from "./MobileMenu";

type MenuListProps = {
  onClick?: () => void;
};

export const Header = ({ onClick }: MenuListProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header>
      <div className="container mx-auto h-full max-w-5xl px-4">
        <div className="leadin flex items-center justify-between py-4 md:py-5">
          <Logo />

          <div className="flex items-center gap-8">
            <NavLink
              className="hidden md:block"
              variant="menu"
              size="link"
              key={"explore"}
              href="/explore"
              onClick={onClick}
            >
              Explore
            </NavLink>

            {user && (
              <NavLink
                className="hidden md:block"
                variant="menu"
                size="link"
                key={"collection"}
                href="/collection"
                onClick={onClick}
              >
                My Collection
              </NavLink>
            )}

            <div className="flex items-center gap-2">
              <UserAvatar />

              <ListIcon
                className="md:hidden"
                size={32}
                weight="bold"
                onClick={() => setOpen(true)}
              />
            </div>

            <MobileMenu open={open} setOpen={setOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};
