// src/pages/ContentsPage.tsx
"use client";
import { contentTypes } from "@/constants/conent-types";
import { cn } from "@/lib/utils";
import type { Content } from "@/types/contents";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
// UI Imports
import { HomeContentCard } from "@/app/layout/HomeContentCard";
import { AuthButton } from "@/components/AuthButton";
import Loader from "@/components/Loader";
import { Logo } from "@/components/Logo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CrownIcon, RowsIcon } from "@phosphor-icons/react/dist/ssr";

export default function ContentsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Contents, setContents] = useState<Content[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 1.0,
      },
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  function handleFilterClick(type: string | null) {
    setActiveType(type);
    setPendingScroll(true);
  }

  useEffect(() => {
    if (pendingScroll) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScroll(false);
    }
  }, [pendingScroll]);

  const getContentTypeMeta = (value: string) => {
    return contentTypes.find((c) => c.value === value);
  };

  useEffect(() => {
    setLoading(true);
    const fetchContents = async (): Promise<void> => {
      try {
        const res = await axios.get(`/api/contents`);
        const data: Content[] = res.data;

        setContents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    fetchContents();
  }, []);

  const usedTypes = new Set<string>(Contents.map((c) => c.type));

  const filterItems = [
    { value: null, label: "All", icon: RowsIcon },
    ...contentTypes.filter((type) => usedTypes.has(type.value)),
  ];

  return (
    <div className={cn("_wrapper bg-white")}>
      <div ref={ref} className="h-1" />
      <div
        className={cn(
          "sticky top-0 z-20 flex items-center justify-between px-6",
          isStuck ? "border-b bg-white" : "",
        )}
      >
        {isStuck && <Logo className="hidden md:flex" />}

        <div
          className={cn(
            "_carousel mx-auto max-w-full bg-white md:max-w-4xl md:px-2.5",
          )}
        >
          <Carousel
            opts={{
              align: "center",
            }}
            className={cn(
              "w-full duration-300",
              isStuck ? "py-2 md:py-3" : "py-4 md:py-5",
            )}
          >
            <CarouselContent>
              {filterItems.length === 1 ? (
                <span className="text-gray-400">No content found</span>
              ) : (
                filterItems.map((type) => {
                  const Icon = type.icon;

                  return (
                    <CarouselItem
                      key={type.value}
                      className={cn("basis-2/5 md:basis-auto")}
                      onClick={() => handleFilterClick(type.value)}
                    >
                      <div
                        className={cn(
                          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-gray-300 bg-gray-50/50 p-2 duration-300 hover:text-rose-600 md:h-12 md:flex-row md:border-white md:bg-white md:px-4 md:hover:border-gray-200/70 md:hover:bg-gray-50",
                          activeType === type.value &&
                            "border font-semibold text-rose-600 md:border-gray-200/70 md:bg-gray-50",
                        )}
                      >
                        <Icon size={20} /> {type.label}
                      </div>
                    </CarouselItem>
                  );
                })
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {isStuck && <AuthButton className="hidden md:flex" />}
      </div>

      <div className="_content mb-8">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-6 flex items-center gap-2 text-2xl font-medium text-lime-600 md:mt-6">
            <CrownIcon size={28} />
            Latest Contents
          </h1>

          <div className="grid md:grid-cols-2 gap-4">
            {loading && <Loader />}

            {!loading && Contents.length === 0 && (
              <div className="flex items-center px-6 text-lg text-gray-500">
                There are no contents yet.
              </div>
            )}

            {Contents.slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .filter((content) => !activeType || content.type === activeType)
              .map((content) => {
                const meta = getContentTypeMeta(content.type);
                const Icon = meta?.icon;

                return (
                  <HomeContentCard
                    key={content.id}
                    content={content}
                    Icon={Icon}
                    meta={meta}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
