// src/app/layout/Conten
"use client";

import { cn } from "@/lib/utils";
import { Content } from "@/types/content";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// UI Imports
import { Icon } from "@/components/ContentIcon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ContentCardProps = {
  content: Content;
  handleDelete?: (id: string) => void;
};

export const ContentCard = ({ content }: ContentCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="group relative h-full flex-1 gap-0 border-none p-0 shadow-none duration-300">
      <CardHeader className="gap-0 p-0">
        <Link href={`/${content.category?.value}/${content.slug}`}>
          <div className="relative aspect-[4/5] max-w-[233px] overflow-hidden rounded-t-lg">
            <Skeleton className="absolute inset-0 h-full w-full" />
            <Image
              src={content.image}
              alt={content.title}
              className={cn(
                "rounded-t-lg transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                "absolute inset-0 h-full w-full object-cover",
              )}
              width={400}
              height={500}
              onLoad={() => setImageLoaded(true)}
              priority
            />
          </div>
        </Link>
      </CardHeader>
      <Link href={`/${content.category?.value}/${content.slug}`}>
        <CardContent className="flex h-full flex-col gap-2 rounded-b-lg bg-lime-50/75 p-3 duration-300 group-hover:bg-lime-300/25 md:gap-2.5 md:px-4.5 md:pb-4.5">
          <div className="flex flex-1 gap-1.5 text-lime-700 duration-300 group-hover:text-rose-600 md:gap-3">
            <h2 className="line-clamp-1 text-base leading-snug font-medium capitalize md:text-lg md:leading-normal">
              {content.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <Icon icon={content.category?.icon} className="size-5 md:size-6" />
            <span className="text-sm md:text-base">
              {content.category?.label}
            </span>
          </div>

          {content.description && (
            <p className="line-clamp-2 text-gray-500 group-hover:text-lime-800">
              {content.description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};
