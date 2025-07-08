// src/app/(site)/components/ContentDetails.tsx
import Image from "next/image";

// UI Imports
import { Icon } from "@/components/ContentIcon";
import { Badge } from "@/components/ui/badge";
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import { Content } from "@/types";

export const ContentDetails = ({ content }: { content: Content }) => {
  return (
    <div className="sticky top-5 flex flex-col gap-2.5 md:gap-5">
      <div className="flex flex-col gap-2.5 md:flex-row md:gap-5">
        <div className="relative aspect-square w-[200px]">
          <Image
            src={content.image}
            alt={content.title}
            sizes="100%"
            fill
            className="rounded-lg object-contain"
            priority
          />
        </div>

        <div className="flex flex-2 flex-col">
          <h2 className="mb-2 border-b-2 pb-2 text-2xl font-semibold capitalize">
            {content.title}
          </h2>
          <div className="flex items-center gap-1.5 py-1.5 text-gray-600">
            <Icon icon={content.category?.icon} />
            <span className="text-[15px]">{content.category?.label}</span>
          </div>
          {content.contentTags.length > 0 && (
            <div className="flex flex-wrap gap-2 py-2.5">
              {content.contentTags.map((item) => (
                <Badge
                  key={item.tag.id}
                  variant={"secondary"}
                  className="pt-.5 rounded border-gray-200 pb-1 capitalize"
                >
                  {item.tag.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1.5 py-1.5">
            <ArrowSquareOutIcon size={20} />
            <a
              href={content.link}
              target="_blank"
              className="text-[15px] underline-offset-4 hover:underline"
            >
              More Content
            </a>
          </div>
        </div>
      </div>
      <p className="text-gray-600">{content.description}</p>
    </div>
  );
};
