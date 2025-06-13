// src/app/panel/page.tsx
"use client";
import { PanelPageHeader } from "@/components/PanelPageHeader";

export default function PanelPage() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader />
    </div>
  );
}
