// src/app/layout/CurationCard.tsx
import { Curation } from "@/types/curation";
import { useRouter } from "next/navigation";

// UI Imports
import * as PhosphorIcons from "@phosphor-icons/react";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { TooltipWrapper } from "@/components/theme/TooltipWrapper";
import {
  FolderIcon,
  NotePencilIcon,
  QuotesIcon,
  TrashIcon,
  UserSoundIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Category } from "@/types";

export type MiniUser = {
  id: string;
};

type CurationCardProps = {
  curation: Curation;
  currentUser: MiniUser;
  category: Category;
  handleDelete?: (id: string) => void;
};

export const CurationCard = ({
  curation: curation,
  currentUser,
  category,
  handleDelete,
}: CurationCardProps) => {
  const router = useRouter();
  const IconMap = PhosphorIcons as unknown as Record<
    string,
    React.FC<IconProps>
  >;
  const IconComponent = IconMap[category.icon] || FolderIcon;

  return (
    <div className="group flex flex-col gap-2 rounded-lg border border-lime-300/70 bg-lime-50/70 p-4 duration-300 md:border-gray-200/70 md:bg-gray-50/70 md:hover:border-lime-300/70 md:hover:bg-lime-50/70">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-lg font-medium group-hover:text-rose-600">
          <TooltipWrapper tooltip={category.label}>
            <IconComponent size={22} />
          </TooltipWrapper>
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
      <div className="text-gray-500 group-hover:text-lime-700">
        <div className="flex items-center gap-1">
          <UserSoundIcon size={20} className="mr-1" />
          <span className="font-medium">
            {curation.user?.id === currentUser.id
              ? "You"
              : curation.user?.fullname}
          </span>
          <span>
            {curation.comment
              ? "Curated this content and said:"
              : "Just curated this content."}
          </span>
        </div>
        {curation.comment && (
          <p className="flex items-center gap-1 pl-6">
            <QuotesIcon size={16} />
            {curation.comment}
          </p>
        )}
      </div>
    </div>
  );
};
