// src/app/home/page.tsx
import { Footer } from "@/app/layout/Footer";
import ContentsPage from "./ContentsPage";
import HeroSection from "./HeroSection";

export default function HomePage() {
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
