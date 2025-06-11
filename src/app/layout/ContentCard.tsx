// src/app/layout/ContentCard.tsx
import { Content } from "@/types/contents";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { useRouter } from "next/navigation";
import { ComponentType, Fragment } from "react";
// UI Imports
import { TooltipWrapper } from "@/components/theme/TooltipWrapper";
import {
  ArrowSquareOutIcon,
  NotePencilIcon,
  TagIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";

type Meta = {
  label: string;
};

type ContentCardProps = {
  content: Content;
  Icon?: ComponentType<IconProps>;
  meta?: Meta;
  handleDelete?: (id: string) => void;
};

export const ContentCard = ({
  content,
  Icon,
  meta,
  handleDelete,
}: ContentCardProps) => {
  const router = useRouter();

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-lime-300/70 bg-lime-50/70 p-4 duration-300 md:border-gray-200/70 md:bg-gray-50/70 md:hover:border-lime-300/70 md:hover:bg-lime-50/70">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-lg font-medium group-hover:text-rose-600">
          {Icon && (
            <TooltipWrapper tooltip={meta?.label}>
              <Icon size={22} />
            </TooltipWrapper>
          )}
          {content.title}
          {content.link && (
            <TooltipWrapper tooltip="Open Link">
              <a href={content.link} target="_blank" rel="noopener noreferrer">
                <ArrowSquareOutIcon
                  size={16}
                  className="group-hover:text-gray-500 hover:text-black md:text-white"
                />
              </a>
            </TooltipWrapper>
          )}
        </h2>

        <div className="_tools flex items-center justify-end gap-2 text-gray-400 drop-shadow-blue-300">
          <TooltipWrapper tooltip="Edit Content">
            <NotePencilIcon
              className="cursor-pointer text-lime-600 md:text-gray-400 md:hover:text-lime-600"
              size={20}
              onClick={() =>
                router.push(`/panel/contents/update/${content.id}`)
              }
            />
          </TooltipWrapper>
          <TooltipWrapper tooltip="Delete Content">
            <TrashIcon
              className="cursor-pointer text-red-600 md:text-gray-400 md:hover:text-red-600"
              size={20}
              onClick={() => handleDelete?.(content.id)}
            />
          </TooltipWrapper>
        </div>
      </div>

      {content.tags?.length > 0 || content.description ? (
        <div className="space-y-2">
          {content.tags?.length > 0 && (
            <div className="flex items-center gap-2.5 capitalize">
              <TagIcon size={16} className="text-gray-600" />
              <div className="flex items-center gap-1">
                {content.tags.map((tag, index) => (
                  <Fragment key={tag}>
                    <Badge variant={"outline"}>{tag}</Badge>

                    {index < content.tags.length - 1 && (
                      <span className="text-gray-400">-</span>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          )}

          {content.description && (
            <p className="text-gray-600">{content.description}</p>
          )}
        </div>
      ) : null}
    </div>
  );
};
