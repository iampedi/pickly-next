// src/app/layout/MenuList.tsx
import { NavLink } from "@/components/theme/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookBookmarkIcon,
  BookmarkIcon,
  CrownSimpleIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: MenuListProps["onClick"];
  canAccess: (user: { isAdmin?: boolean; isCurator?: boolean }) => boolean;
};

type MenuListProps = {
  onClick?: () => void;
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
  {
    label: "Bookmarks",
    href: "/panel/bookmarks",
    icon: <BookmarkIcon weight="duotone" />,
    canAccess: (user) => !!user.isAdmin,
  },
];
export const MenuList = ({ onClick }: MenuListProps) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-3">
      {panelMenu
        .filter((item) => item.canAccess(user))
        .map((item) => (
          <NavLink key={item.href} href={item.href} onClick={onClick}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
    </div>
  );
};
