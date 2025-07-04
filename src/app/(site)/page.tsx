// src/app/page.tsx
"use client";

import HeroSection from "@/app/(site)/components/HeroSection";
import { HomeLatestContents } from "./components/HomeLatestContents";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <HomeLatestContents />
    </>
  );
}
