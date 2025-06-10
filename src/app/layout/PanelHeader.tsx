// src/app/layout/PanelHeader.tsx
"use client";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const titles: Record<string, string> = {
  "/panel": "Panel",
  "/panel/contents": "Contents",
  "/panel/contents/create": "Create a content",
  "/panel/contents/update/:id": "Update a content",
  "/panel/users": "Users",
  "/panel/settings": "Settings",
};

function getTitle(path: string) {
  if (titles[path]) return titles[path];
  // Regex فقط برای UUID
  if (
    /^\/panel\/contents\/update\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      path,
    )
  )
    return titles["/panel/contents/update/:id"];
  return "";
}

export const PanelHeader = () => {
  const pathname = usePathname();
  const title = getTitle(pathname) || "Panel";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white">
      <Logo />
      <h1 className="flex items-center gap-2 font-semibold">
        <span className="text-3xl text-gray-400">{"{"}</span>
        <span className="text-2xl">{title}</span>
        <span className="text-3xl text-gray-400">{"}"}</span>
      </h1>
    </header>
  );
};
