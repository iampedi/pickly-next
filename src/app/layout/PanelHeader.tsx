// src/app/layout/PanelHeader.tsx
"use client";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const titles: Record<string, string> = {
  "/panel": "Panel",
  "/panel/contents": "Contents",
  "/panel/contents/create": "Create a content",
  "/panel/users": "Users",
  "/panel/settings": "Settings",
};

export const PanelHeader = () => {
  const pathname = usePathname();
  const title = titles[pathname] || "Panel";

  return (
    <header className="flex h-14 items-center justify-between">
      <Logo />
      <h1 className="flex items-center gap-2 font-semibold">
        <span className="text-3xl text-gray-400">{"{"}</span>
        <span className="text-2xl">{title}</span>
        <span className="text-3xl text-gray-400">{"}"}</span>
      </h1>
    </header>
  );
};
