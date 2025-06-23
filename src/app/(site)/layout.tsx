// src/app/(site)/layout.tsx
import { Suspense } from "react";

// UI Imports
import { SiteShell } from "@/app/layout/SiteShell";
import Loader from "@/components/Loader";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<Loader />}>
        <SiteShell>{children}</SiteShell>
      </Suspense>
    </div>
  );
}
