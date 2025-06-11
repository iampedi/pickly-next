// src/app/layout/PanelSide.tsx
"use client";
import { NavLink } from "@/components/theme/NavLink";
import {
  BookBookmarkIcon,
  CrownSimpleIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/contexts/AuthContext";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  canAccess: (user: { isAdmin?: boolean; isCurator?: boolean }) => boolean;
};

const panelMenu: MenuItem[] = [
  {
    label: "Panel",
    href: "/panel",
    icon: <CrownSimpleIcon weight="duotone" />,
    canAccess: () => true,
  },
  {
    label: "Curations",
    href: "/panel/curations",
    icon: <StarIcon weight="duotone" />,
    canAccess: (user) => !!user.isAdmin || !!user.isCurator,
  },
  {
    label: "Contents",
    href: "/panel/contents",
    icon: <BookBookmarkIcon weight="duotone" />,
    canAccess: (user) => !!user.isAdmin,
  },
];

export const PanelSide = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="sticky top-22 w-1/4 self-start hidden md:block">
      <div className="flex flex-col gap-3">
        {panelMenu
          .filter((item) => item.canAccess(user))
          .map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </div>
    </aside>
  );
};
