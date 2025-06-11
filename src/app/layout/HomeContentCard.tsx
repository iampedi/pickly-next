// src/app/layout/ContentCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Content } from "@/types/contents";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { ComponentType } from "react";
// UI Imports

type Meta = {
  label: string;
};

type ContentCardProps = {
  content: Content;
  Icon?: ComponentType<IconProps>;
  meta?: Meta;
  handleDelete?: (id: string) => void;
};

export const HomeContentCard = ({ content, Icon, meta }: ContentCardProps) => {
  return (
    <Card className="group h-[162px] border-lime-200/75 bg-lime-50/35 hover:border-lime-300/75 hover:bg-lime-50/70">
      <CardContent className="flex flex-col gap-1.5">
        <h2 className="text-lg font-medium text-lime-800 duration-300 group-hover:text-rose-600">
          {content.title}
        </h2>
        <div className="flex items-center gap-1.5 text-gray-500">
          {Icon ? <Icon size={20} /> : null}
          {meta?.label}
        </div>
        {content.description && (
          <p className="line-clamp-2 text-gray-400">{content.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
