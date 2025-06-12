// src/app/home/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
// UI Imports
import { Footer } from "@/app/layout/Footer";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import ContentsPage from "./ContentsPage";
import HeroSection from "./HeroSection";

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("logout") === "true") {
      toast.success("Logout successful!");
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
