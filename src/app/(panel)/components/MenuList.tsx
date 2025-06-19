// src/app/layout/MenuList.tsx
import { NavLink } from "@/components/theme/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  BooksIcon,
  SquaresFourIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: MenuListProps["onClick"];
  canAccess: (user: { role: string }) => boolean;
};

type MenuListProps = {
  onClick?: () => void;
};

const panelMenu: MenuItem[] = [
  {
    label: "Panel",
    href: "/panel",
    icon: <SquaresFourIcon weight="duotone" />,
    canAccess: () => true,
  },
  {
    label: "Curations",
    href: "/panel/curations",
    icon: <StarIcon weight="duotone" />,
    canAccess: () => true,
  },
  {
    label: "Contents",
    href: "/panel/contents",
    icon: <BooksIcon weight="duotone" />,
    canAccess: (user) => user.role === "ADMIN",
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
          <NavLink
            variant="panel"
            size="menu"
            key={item.href}
            href={item.href}
            onClick={onClick}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
    </div>
  );
};
