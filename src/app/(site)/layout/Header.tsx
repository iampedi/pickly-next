// src/app/(site)/layout/Header.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

// UI Imports
import { Logo } from "@/components/Logo";
import { UserAvatar } from "@/components/UserAvatar";
import { NavLink } from "@/components/theme/NavLink";

type MenuListProps = {
  onClick?: () => void;
};

export const Header = ({ onClick }: MenuListProps) => {
  const { user } = useAuth();

  return (
    <header>
      <div className="continer mx-auto h-full max-w-5xl px-4">
        <div className="leadin flex items-center justify-between py-5">
          <Logo />

          <div className="flex items-center gap-8">
            <NavLink
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
                variant="menu"
                size="link"
                key={"collection"}
                href="/collection"
                onClick={onClick}
              >
                My Collection
              </NavLink>
            )}

            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};
