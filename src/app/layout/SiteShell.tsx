// src/app/layout/PanelShell.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

// UI Imports
import Loader from "@/components/Loader";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const SiteShell = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <>
      <Header />

      <main className="flex flex-1 flex-col">{children}</main>

      <Footer />
    </>
  );
};
