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
import Image from "next/image";

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
    <div className="group relative flex gap-3 rounded-lg border border-lime-300/70 bg-lime-50/70 p-3 duration-300 md:gap-4 md:border-gray-200/70 md:bg-gray-50/70 md:p-4 md:hover:border-lime-300/70 md:hover:bg-lime-50/70">
      <div className="_image pb-7 md:min-w-[100px] md:pb-0">
        <Image
          src={curation.content?.image ?? ""}
          alt={curation.content?.title ?? ""}
          width={100}
          height={148}
          priority
          className="rounded-md object-cover"
        />
      </div>
      <div className="_content flex w-full flex-col gap-1.5">
        <h2 className="flex items-center gap-1.5 text-[17px] font-medium text-rose-600 capitalize md:text-lg md:text-gray-500 md:group-hover:text-rose-600">
          <Icon icon={category.icon} />
          <span className="hidden text-sm uppercase md:block">
            [{category.label}] -
          </span>
          {curation.content?.title}
        </h2>
        <div className="flex flex-col text-lime-700 md:gap-1 md:text-gray-500 md:group-hover:text-lime-700">
          <div className="inline-flex flex-col gap-1 text-[15px] whitespace-pre-line md:flex-row md:items-center md:text-base">
            <div className="flex items-center md:gap-1">
              <UserSoundIcon size={20} className="mr-1" />
              <span className="font-medium">
                {curation.user?.id === currentUser.id
                  ? "You:"
                  : curation.user?.fullname}
              </span>
            </div>
            <span>
              {curation.comment
                ? "Curated this content and said:"
                : "Just curated this content."}
            </span>
          </div>
          {curation.comment && (
            <p className="line-clamp-2 text-[15px] md:line-clamp-3 md:pl-7 md:text-base leading-6">
              {curation.comment}
            </p>
          )}
        </div>

        <div className="_tools absolute bottom-2.5 left-6 flex items-center justify-end gap-1.5 text-gray-400 drop-shadow-blue-300 md:top-5 md:right-4 md:bottom-auto md:left-auto">
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
    </div>
  );
};
