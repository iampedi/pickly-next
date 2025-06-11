// src/app/layout/PanelHeader.tsx
"use client";
import { Logo } from "@/components/Logo";
import { UserAvatar } from "./UserAvatar";

export const PanelHeader = () => {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-white">
      <Logo />

      <UserAvatar />
    </header>
  );
};
