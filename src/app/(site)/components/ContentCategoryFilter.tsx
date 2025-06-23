// src/components/ContentCategoryFilter.tsx
"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types";

// UI Imports
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/theme/carousel";
import { Icon } from "@/components/ContentIcon";

type ContentCategoryFilterProps = {
  filterItems: Category[];
  activeCategory: string | null;
  setActiveCategory: (categoryId: string | null) => void;
};

export const ContentCategoryFilter = ({
  filterItems,
  activeCategory,
  setActiveCategory,
}: ContentCategoryFilterProps) => {
  const categories = [
    { id: "", label: "All", icon: "FolderIcon" },
    ...filterItems,
  ];

  function handleFilterClick(categoryId: string | null) {
    setActiveCategory(categoryId);
  }

  return (
    <div className="_carousel mx-auto max-w-full md:max-w-5xl md:px-2.5">
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-full py-4 duration-300 md:py-5"
      >
        <CarouselContent>
          {categories.map((category) => {
            return (
              <CarouselItem
                key={category.id}
                className="basis-2/5 md:basis-auto"
                onClick={() => handleFilterClick(category.id)}
              >
                <div
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-gray-50/50 p-2 duration-300 hover:text-rose-600 md:h-12 md:flex-row md:border-white md:bg-white md:px-4 md:hover:border-gray-200/70 md:hover:bg-gray-50",
                    activeCategory === category.id &&
                      "border font-semibold text-rose-600 md:border-gray-200/70 md:bg-gray-50",
                  )}
                >
                  <Icon icon={category.icon} size={20} weight="duotone" />{" "}
                  {category.label}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
