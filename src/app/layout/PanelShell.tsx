// src/app/layout/PanelShell.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

// UI Imports
import Loader from "@/components/Loader";
import { PanelHeader } from "@/app/layout/PanelHeader";
import { PanelSide } from "@/app/layout/PanelSide";
import { Footer } from "./Footer";

export const PanelShell = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <>
      <PanelHeader />

      <div className="flex flex-1 flex-col gap-8 md:flex-row">
        <PanelSide />

        <main className="flex flex-1 flex-col">
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
};
