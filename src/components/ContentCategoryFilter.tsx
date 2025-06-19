// src/components/ContentCategoryFilter.tsx
"use client";

// UI Imports
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/theme/carousel";
import { cn } from "@/lib/utils";

export const ContentCategoryFilter = ({
  filterItems,
  setActiveType,
}: {
  filterItems: {
    value: string | null;
    label: string;
    icon: React.ElementType;
  };
  setActiveType: (type: string | null) => void[];
}) => {
  function handleFilterClick(type: string | null) {
    setActiveType(type);
  }

  return (
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
                className="basis-2/5 md:basis-auto"
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
  );
};
