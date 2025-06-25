// src/pages/home/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

// UI Imports
import image from "@/assets/images/hero-section-01.webp";
import { Button } from "@/components/theme/button";

export default function HeroSection() {
  return (
    <div className="_hero-section bg-gradient-to-t from-lime-100 to-white">
      <div className="continer mx-auto h-full max-w-5xl px-4">
        <div className="_wrapper flex h-full flex-col">
          <div className="_content flex flex-1 flex-col content-around items-center justify-center gap-8 px-2 pt-6 pb-12 md:flex-row md:gap-10 md:px-0 md:py-20">
            <div className="md:w-2/3">
              <h2 className="mb-2 text-[26px] font-semibold md:mb-4 md:text-[40px] md:font-medium">
                Content worth your time.
              </h2>
              <div className="space-y-3 text-xl text-gray-600 md:text-2xl md:leading-9">
                <p>
                  In a world overwhelmed by noise, we’re building a space for
                  clarity, connection, and care. Here, real people share real
                  recommendations — not for attention, but for intention.
                </p>
                <p className="text-black underline">
                  No likes. No followers. Just curated content.
                </p>
              </div>
              <Button
                className="mt-6 w-full md:mt-8 md:w-auto"
                size={"lg"}
                asChild
              >
                <Link href="/explore">Explore Contents</Link>
              </Button>
            </div>
            <div className="md:w-1/3">
              <Image
                src={image}
                alt="Hero Section"
                className="max-h-[55vw] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
