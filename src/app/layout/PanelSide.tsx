// src/app/layout/PanelSide.tsx
"use client";
import { MenuList } from "@/app/(panel)/components/MenuList";

export const PanelSide = () => {
  return (
    <aside className="sticky top-22 hidden w-1/4 self-start md:block">
      <MenuList />
    </aside>
  );
};
