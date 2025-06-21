// src/app/layout/PanelHeader.tsx
"use client";

import { useState } from "react";

// UI Imports
import { Logo } from "@/components/Logo";
import { UserAvatar } from "@/components/UserAvatar";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import { MobileMenu } from "@/app/layout/MobileMenu";

export const PanelHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white md:h-20">
        <Logo />

        <div className="flex items-center gap-2">
          <UserAvatar />

          <ListIcon
            className="md:hidden"
            size={32}
            weight="bold"
            onClick={() => setOpen(true)}
          />
        </div>
      </header>

      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
};
