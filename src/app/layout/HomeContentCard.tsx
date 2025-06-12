// src/app/layout/ContentCard.tsx
import { TooltipWrapper } from "@/components/theme/TooltipWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Content } from "@/types/contents";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import {
  BookmarkIcon,
  HandsPrayingIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ComponentType } from "react";
import { ToggleIcon } from "@/components/theme/ToggleIcon";
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
    <Card className="group relative border-lime-200/75 bg-lime-50/35 duration-300 hover:border-lime-300/75 hover:bg-lime-50/70">
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3 text-lime-800 duration-300 group-hover:text-rose-600">
          {Icon && (
            <TooltipWrapper tooltip={meta?.label}>
              <div className="rounded-full bg-lime-800/15 p-1.5 duration-300 group-hover:bg-rose-800/15">
                <Icon size={20} />
              </div>
            </TooltipWrapper>
          )}
          <h2 className="text-lg font-medium">{content.title}</h2>
        </div>

        <div className="flex items-center justify-between pl-3 text-gray-500 group-hover:text-lime-800">
          <div className="flex items-center gap-2">
            <strong>{content.curations?.length}</strong> time
            {content.curations?.length < 2 ? "" : "s"} curated.
          </div>
        </div>

        {content.description && (
          <p className="line-clamp-1 text-gray-400 group-hover:text-lime-800">
            {content.description}
          </p>
        )}

        <div className="mt-2 flex h-6 items-center justify-end">
          {/* <Button variant={"outline"} size={"sm"}>
            Details
          </Button> */}
          <div>
            <div className="animate-in flex items-center gap-4 text-gray-400 duration-300 group-hover:text-lime-800">
              <ToggleIcon icon={BookmarkIcon} tooltip="Save" />
              <ToggleIcon icon={SparkleIcon} tooltip="Inspiring" />
              <ToggleIcon icon={HandsPrayingIcon} tooltip="Thanks" />
            </div>
          </div>
        </div>

        {/* <div className="absolute right-0 bottom-0 flex items-center gap-1.5 rounded-tl-xl rounded-br-xl bg-transparent px-3 py-1.5 text-[15px] text-lime-800/60 duration-300 group-hover:bg-lime-800/70 group-hover:text-lime-50">
    
        </div> */}
      </CardContent>
    </Card>
  );
};
