// src/app/layout/Conten
"use client";

import { Content } from "@/types/content";
import Image from "next/image";
import Link from "next/link";

// UI Imports
import { Icon } from "@/components/ContentIcon";

type ContentCardProps = {
  content: Content;
  handleDelete?: (id: string) => void;
};

export const ContentCard = ({ content }: ContentCardProps) => {
  return (
    <Link href={`/${content.category?.value}/${content.slug}`}>
      <div className="group flex flex-col rounded-xl border-2 p-5 pt-4 duration-300 hover:border-lime-800/60">
        <div className="flex gap-2.5">
          <Image
            src={content.image}
            alt={content.title}
            width={54}
            height={54}
            priority
          />
          <div className="flex flex-col">
            <h2 className="line-clamp-1 text-base leading-snug font-medium capitalize duration-300 group-hover:text-rose-600 md:text-lg md:leading-normal">
              {content.title}
            </h2>
            <div className="flex items-center gap-1 text-gray-500">
              <Icon icon={content.category?.icon} className="size-5" />
              <span className="text-sm">{content.category?.label}</span>
            </div>
          </div>
        </div>
        <div>
          {content.description && (
            <p className="sleading-tight line-clamp-2 text-gray-500 duration-300 group-hover:text-lime-800">
              {content.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
