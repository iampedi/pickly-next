// src/app/layout/CurationCard.tsx
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { useRouter } from "next/navigation";
import { ComponentType } from "react";
// UI Imports
import { TooltipWrapper } from "@/components/theme/TooltipWrapper";
import { NotePencilIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { Curation } from "@/types/curations";

type Meta = {
  label: string;
};

type CurationCardProps = {
  curation: Curation;
  Icon?: ComponentType<IconProps>;
  meta?: Meta;
  handleDelete?: (id: string) => void;
};

export const CurationCard = ({
  curation: curation,
  Icon,
  meta,
  handleDelete,
}: CurationCardProps) => {
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
          {curation.content?.title}
        </h2>

        <div className="_tools flex items-center justify-end gap-2 text-gray-400 drop-shadow-blue-300">
          <TooltipWrapper tooltip="Edit Content">
            <NotePencilIcon
              className="cursor-pointer text-lime-600 md:text-gray-400 md:hover:text-lime-600"
              size={20}
              onClick={() =>
                router.push(`/panel/curations/update/${curation.id}`)
              }
            />
          </TooltipWrapper>
          <TooltipWrapper tooltip="Delete Content">
            <TrashIcon
              className="cursor-pointer text-red-600 md:text-gray-400 md:hover:text-red-600"
              size={20}
              onClick={() => handleDelete?.(curation.id)}
            />
          </TooltipWrapper>
        </div>
      </div>

      {curation.comment && <p className="text-gray-600">{curation.comment}</p>}
    </div>
  );
};
