// src/pages/ContentsPage.tsx
"use client";

import { contentTypes } from "@/constants/conent-types";
import { cn } from "@/lib/utils";
import type { Content } from "@/types/contents";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

// UI Imports
import { HomeContentCard } from "@/app/layout/HomeContentCard";
import Loader from "@/components/Loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RowsIcon } from "@phosphor-icons/react/dist/ssr";

export default function ContentsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState(false);

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

  const usedTypes = new Set<string>(contents.map((c) => c.type));

  const filterItems = [
    { value: null, label: "All", icon: RowsIcon },
    ...contentTypes.filter((type) => usedTypes.has(type.value)),
  ];

  return (
    <main className="flex flex-1 flex-col">
      {filterItems.length > 1 && (
        <div className="_carousel mx-auto max-w-full md:max-w-4xl md:px-2.5">
          <Carousel
            opts={{
              align: "center",
            }}
            className="w-full py-4 duration-300 md:py-5"
          >
            <CarouselContent>
              {filterItems.map((type) => {
                const Icon = type.icon;

                return (
                  <CarouselItem
                    key={type.value}
                    className="basis-2/5 pl-2 md:basis-auto"
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
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      )}

      <div className="_content flex flex-1 flex-col">
        <div className="container mx-auto flex max-w-4xl flex-1 flex-col px-4">
          {loading ? (
            <Loader />
          ) : (
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {!loading && contents.length === 0 && (
                <div className="col-span-2 flex flex-1 items-center justify-center text-gray-500">
                  There are no contents to show.
                </div>
              )}

              {contents
                .slice()
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
          )}
        </div>
      </div>
    </main>
  );
}
