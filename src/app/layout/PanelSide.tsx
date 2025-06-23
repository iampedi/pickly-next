// src/app/layout/PanelSide.tsx
"use client";
import { PanelMenuList } from "@/app/(panel)/components/PanelMenuList";

export const PanelSide = () => {
  return (
    <aside className="sticky top-22 hidden w-1/4 self-start md:block">
      <PanelMenuList />
    </aside>
  );
};
