// src/app/layout/MenuList.tsx
import { NavLink } from "@/components/theme/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  BooksIcon,
  HouseIcon,
  SquaresFourIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: MenuListProps["onClick"];
  canAccess?: (user: { role: string }) => boolean;
  exact?: boolean;
};

type MenuListProps = {
  onClick?: () => void;
};
const publicMenu: MenuItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <HouseIcon weight="duotone" />,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: <StarIcon weight="duotone" />,
  },
  {
    label: "My Collection",
    href: "/collection",
    icon: <BooksIcon weight="duotone" />,
  },
];

const dashboardMenu: MenuItem = {
  label: "Dashboard",
  href: "/panel",
  icon: <SquaresFourIcon weight="duotone" />,
  exact: true,
};

export const MenuList = ({ onClick }: MenuListProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-3">
      {publicMenu.map((item) => (
        <NavLink
          variant="panel"
          size="menu"
          key={item.href}
          href={item.href}
          onClick={onClick}
          exact={item.exact}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}

      {/* فقط اگه لاگین بود و نقش USER نبود */}
      {user && user.role !== "USER" && (
        <NavLink
          variant="panel"
          size="menu"
          key={dashboardMenu.href}
          href={dashboardMenu.href}
          onClick={onClick}
          exact={dashboardMenu.exact}
        >
          {dashboardMenu.icon}
          <span>{dashboardMenu.label}</span>
        </NavLink>
      )}
    </div>
  );
};
