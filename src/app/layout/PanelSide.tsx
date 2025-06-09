// src/app/layout/PanelSide.tsx
import { NavLink } from "@/components/theme/NavLink";
import {
  BookBookmarkIcon,
  CrownSimpleIcon,
  ToggleLeftIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";

export const PanelSide = () => {
  return (
    <aside className="w-1/4">
      <div className="flex flex-col gap-3">
        <NavLink href="/panel">
          <CrownSimpleIcon weight="duotone" />
          <span>Panel</span>
        </NavLink>
        <NavLink href="/panel/contents">
          <BookBookmarkIcon weight="duotone" />
          <span>Contents</span>
        </NavLink>
        <NavLink href="/panel/users">
          <UsersIcon weight="duotone" />
          <span>Users</span>
        </NavLink>
        <NavLink href="/panel/setting">
          <ToggleLeftIcon weight="duotone" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};
