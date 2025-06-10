// src/app/home/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
// UI Imports
import { Footer } from "@/app/layout/Footer";
import ContentsPage from "./ContentsPage";
import HeroSection from "./HeroSection";
import { toast } from "sonner";

export default function HomePage() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("logout") === "true") {
      toast.success("User registered successfully!");
    }
  }, [params]);

  return (
    <main className="relative">
      <HeroSection />

      <div className="relative z-10 md:mt-[560px]">
        <ContentsPage />
      </div>

      <Footer />
    </main>
  );
}
