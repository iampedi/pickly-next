// src/components/PanelPageTitle.tsx
"use client";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/panel": "Panel",
  "/panel/contents": "Contents",
  "/panel/contents/create": "Create a content",
  "/panel/contents/update/:id": "Update Content",
  "/panel/curations": "Curations",
  "/panel/curations/create": "Create a curation",
  "/panel/curations/update/:id": "Update curation",
  "/panel/users": "Users",
};

export const PanelPageTitle = () => {
  const pathname = usePathname();
  const title = getTitle(pathname) || "Panel";

  function getTitle(path: string) {
    if (titles[path]) return titles[path];

    if (
      /^\/panel\/contents\/update\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        path,
      )
    )
      return titles["/panel/contents/update/:id"];

    if (
      /^\/panel\/curations\/update\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        path,
      )
    )
      return titles["/panel/curations/update/:id"];

    return "";
  }

  return (
    <h1 className="flex items-center gap-2 font-semibold">
      <span className="text-2xl text-gray-400">{"{"}</span>
      <span className="text-xl">{title}</span>
      <span className="text-2xl text-gray-400">{"}"}</span>
    </h1>
  );
};
