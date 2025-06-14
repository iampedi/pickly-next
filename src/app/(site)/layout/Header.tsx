// src/app/(site)/layout/Header.tsx

// UI Imports
import { Logo } from "@/components/Logo";
import { UserAvatar } from "@/components/UserAvatar";
import { NavLink } from "@/components/theme/NavLink";

type MenuListProps = {
  onClick?: () => void;
};

export const Header = ({ onClick }: MenuListProps) => {
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

            <NavLink
              variant="menu"
              size="link"
              key={"collection"}
              href="/collection"
              onClick={onClick}
            >
              My Collection
            </NavLink>

            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};
