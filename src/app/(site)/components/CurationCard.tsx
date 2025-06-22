// src/app/layout/CurationCard.tsx
import { Category } from "@/types";
import { Curation } from "@/types/curation";
import { useRouter } from "next/navigation";

// UI Imports
import { Icon } from "@/components/ContentIcon";
import { TooltipWrapper } from "@/components/theme/TooltipWrapper";
import {
  NotePencilIcon,
  TrashIcon,
  UserSoundIcon,
} from "@phosphor-icons/react/dist/ssr";

export type MiniUser = {
  id: string;
};

type CurationCardProps = {
  curation: Curation;
  currentUser: MiniUser;
  category: Category;
  onRequestDelete?: (id: string) => void;
};

export const CurationCard = ({
  curation: curation,
  currentUser,
  category,
  onRequestDelete,
}: CurationCardProps) => {
  const router = useRouter();

  return (
    <div className="group flex flex-col gap-2 rounded-lg border border-lime-300/70 bg-lime-50/70 p-4 duration-300 md:border-gray-200/70 md:bg-gray-50/70 md:hover:border-lime-300/70 md:hover:bg-lime-50/70">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium text-gray-500 capitalize group-hover:text-rose-600">
          <Icon icon={category.icon} />
          <span className="hidden text-sm uppercase md:block">
            [{category.label}] -
          </span>
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
              onClick={() => onRequestDelete?.(curation.id)}
            />
          </TooltipWrapper>
        </div>
      </div>
      <div className="pb-1 text-gray-500 group-hover:text-lime-700">
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
          <p className="mt-1 line-clamp-2 pl-7">{curation.comment}</p>
        )}
      </div>
    </div>
  );
};
