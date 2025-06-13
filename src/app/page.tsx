// src/app/page.tsx
"use client";
import { Footer } from "@/app/layout/Footer";
import HeroSection from "@/app/layout/HeroSection";
import { Header } from "@/app/layout/Header";

export default function HomePage() {
  return (
    <main className="relative">
      <Header />

      <HeroSection />

      <Footer />
    </main>
  );
}
