// src/app/(site)/components/ContentCurations.tsx
import { Curation } from "@/types";

// UI Imports
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const ContentCurations = ({ item }: { item: Curation }) => {
  return (
    <div className="group relative rounded-xl border bg-gray-50/75 p-5 duration-300 hover:border-lime-800/35 hover:bg-lime-50">
      <div className="absolute -top-[17.5px] left-1/2 h-[13px] w-[1px] -translate-x-1/2 bg-gray-300 group-hover:bg-lime-600 before:absolute before:-top-2 before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-gray-300 before:content-[''] group-hover:before:bg-lime-600 after:absolute after:top-3 after:left-0 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-gray-300 after:content-[''] group-hover:after:bg-lime-600 md:top-1/2 md:-left-[11px] md:h-[1px] md:w-[19.5px] md:-translate-y-1/2 md:before:top-1/2 md:before:left-5.25 md:before:-translate-y-1/2 md:after:top-1/2 md:after:-right-8 md:after:-translate-y-1/2"></div>

      <div className="mb-2 flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarImage
            src={item.user?.avatar || "https://github.com/shadcn.png"}
            className="opacity-80"
          />
        </Avatar>
        <span className="font-medium text-gray-500 group-hover:text-rose-600">
          {item.user?.fullname}
        </span>
      </div>
      <p className="leading-snug text-gray-600 group-hover:text-lime-800 md:text-gray-500">
        {item.comment}
      </p>
    </div>
  );
};
