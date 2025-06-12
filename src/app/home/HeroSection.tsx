// src/pages/home/HeroSection.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// UI Imports
import image from "@/assets/images/hero-section-01.webp";
import { AuthButton } from "@/components/AuthButton";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/theme/Button";

export default function HeroSection() {
  const [vh, setVh] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setVh(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth && windowWidth < 768;

  return (
    <div
      className="bg-gradient-to-t from-lime-100 to-white md:fixed md:top-0 md:right-0 md:left-0 md:h-[560px]"
      style={{
        height: isMobile ? `calc(${vh}px)` : undefined,
        maxHeight: isMobile ? `calc(${vh}px)` : undefined,
      }}
    >
      <div className="continer mx-auto h-full max-w-5xl px-4">
        <div className="_wrapper flex h-full flex-col">
          <div className="_header flex items-center justify-between pt-4 md:pt-5">
            <Logo />
            <div className="flex gap-2">
              <AuthButton />
            </div>
          </div>

          <div className="_content flex flex-1 flex-col content-around items-center justify-center gap-8 px-2 py-8 md:flex-row md:gap-10 md:px-0">
            <div className="md:w-2/3">
              <h2 className="mb-2 text-[26px] font-semibold md:mb-4 md:text-[40px] md:font-medium">
                Content worth your time.
              </h2>
              <p className="text-xl text-gray-600 md:text-2xl md:leading-9">
                In a world overwhelmed by noise, we’re building a space for
                clarity, connection, and care. Here, real people share real
                recommendations — not for attention, but for intention.
                <br />
                <span className="text-black underline">
                  No likes. No followers. Just curated content.
                </span>
              </p>
              <Button className="mt-5 w-full md:w-auto md:mt-8" size={"lg"} asChild>
                <Link href="/auth/login">Become a Curator</Link>
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
