// src/app/(site)/[category]/[slug]/page.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Content } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// UI Imports
import { Icon } from "@/components/ContentIcon";
import { Badge } from "@/components/ui/badge";
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function ContentDetailPage() {
  const { slug, category } = useParams();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    if (!slug || !category) return;

    const fetchContent = async () => {
      try {
        const res = await axios.get(`/api/${category}/${slug}`);
        setContent(res.data);
      } catch (err) {
        handleClientError(err, "Failed to fetch content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, category]);

  if (loading) {
    return (
      <div className="_page py-6">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="_page py-6">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div>Content not found.</div>
        </div>
      </div>
    );
  }

  console.log(content);

  return (
    <div className="_page border-t border-gray-200/75 py-6">
      <div className="container mx-auto h-full max-w-5xl px-4">
        <div className="_wrapper flex gap-5">
          <div className="w-1/2">
            <div className="sticky top-5 flex flex-col gap-4">
              <div className="flex gap-5">
                <div className="relative aspect-[2/3] w-[200px]">
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
                  <h2 className="mb-2 text-2xl font-semibold capitalize border-b-2 pb-2">
                    {content.title}
                  </h2>
                  <div className="flex items-center gap-1.5 py-1.5 text-gray-600">
                    <Icon icon={content.category?.icon} />
                    <span className="text-[15px]">
                      {content.category?.label}
                    </span>
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
                      More Detail
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{content.description}</p>
            </div>
          </div>
          <div className="_content flex w-1/2 flex-col gap-3 border-l pl-5">
            {content.curations.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl border bg-gray-50/75 p-5"
              >
                <div className="absolute top-1/2 -left-[17.5px] h-[1px] w-[13px] -translate-y-1/2 bg-gray-300 before:absolute before:top-1/2 before:-left-2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-gray-300 before:content-[''] after:absolute after:top-1/2 after:-right-2 after:h-2 after:w-2 after:-translate-y-1/2 after:rounded-full after:bg-gray-300 after:content-['']"></div>

                <div className="mb-2 flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={item.user?.avatar || "https://github.com/shadcn.png"}
                      className="opacity-80"
                    />
                  </Avatar>
                  <span className="font-medium text-gray-500">
                    {item.user?.fullname}
                  </span>
                </div>
                <p className="text-gray-600">{item.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
