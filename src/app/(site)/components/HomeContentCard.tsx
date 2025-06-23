// src/app/layout/Conten
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Content } from "@/types/content";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import { ToggleIcon } from "@/components/theme/ToggleIcon";
import { TooltipWrapper } from "@/components/theme/TooltipWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BookmarkIcon,
  HandsPrayingIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { Icon } from "@/components/ContentIcon";
import Image from "next/image";

type ContentCardProps = {
  content: Content;
  handleDelete?: (id: string) => void;
  onChangeBookmark?: () => void;
};

export const HomeContentCard = ({
  onChangeBookmark,
  content,
}: ContentCardProps) => {
  const [bookmarkActive, setBookmarkActive] = useState(false);
  const [inspiredActive, setInspiredActive] = useState(false);
  const [thanksActive, setThanksActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await axios.get("/api/action", {
          params: { contentId: content.id },
          withCredentials: true,
        });
        setBookmarkActive(res.data.bookmark);
        setInspiredActive(res.data.inspired);
        setThanksActive(res.data.thanks);
      } catch (err) {
        handleClientError(err, "Failed to fetch actions.");
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [content.id]);

  const handleAction = async (type: "BOOKMARK" | "INSPIRED" | "THANKS") => {
    try {
      await axios.post("/api/action", {
        contentId: content.id,
        type,
      });

      if (type === "BOOKMARK") {
        const next = !bookmarkActive;
        setBookmarkActive(next);
        toast.success(
          next ? "This item is collected." : "This item is uncollected.",
        );
      }

      if (type === "INSPIRED") {
        const next = !inspiredActive;
        setInspiredActive(next);
        toast.success(
          next ? "This item is inspired." : "This item is uninspired.",
        );
      }

      if (type === "THANKS") {
        const next = !thanksActive;
        setThanksActive(next);
        toast.success(
          next ? "This item is thanked." : "This item is unthanked.",
        );
      }

      if (type === "BOOKMARK" && typeof onChangeBookmark === "function") {
        onChangeBookmark();
      }
    } catch (err) {
      handleClientError(err, "Failed to handle action.");
    }
  };

  console.log("Pedram is watching... ", content.curations?.length);

  const curationsCount = content.curations?.length || 0;

  if (loading) return null;

  return (
    <Card className="group relative h-full flex-1 gap-0 border-none p-0 shadow-none duration-300">
      <CardHeader className="gap-0 p-0">
        <Image
          src={content.image}
          alt={content.title}
          width={400}
          height={0}
          className="rounded-t-lg duration-300 group-hover:rounded-t-lg"
          priority
        />
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-2 rounded-b-lg bg-lime-50/75 p-3 duration-300 group-hover:bg-lime-300/25 md:gap-3 md:px-4 md:pb-4.5">
        <div className="flex flex-1 gap-1.5 text-lime-700 duration-300 group-hover:text-rose-600 md:gap-3">
          <h2 className="line-clamp-2 text-base leading-snug font-medium capitalize md:text-lg md:leading-normal">
            {content.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <Icon icon={content.category?.icon} className="size-5 md:size-6" />
          <span className="text-sm md:text-base">
            {content.category?.label}
          </span>
        </div>

        {/* <div className="flex items-center justify-between pl-1.5 text-gray-500 group-hover:text-lime-800 md:pl-3">
          <div className="flex items-center gap-1.5 text-sm">
            <strong>{content.curations?.length || 0}</strong> .
          </div>
        </div> */}

        {content.description && (
          <p className="line-clamp-1 text-gray-500 group-hover:text-lime-800">
            {content.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="mt-1 flex items-center gap-3">
            <ToggleIcon
              icon={BookmarkIcon}
              tooltip="Collect"
              active={bookmarkActive}
              onClick={() => handleAction("BOOKMARK")}
            />
            <ToggleIcon
              icon={SparkleIcon}
              tooltip="Inspired"
              active={inspiredActive}
              onClick={() => handleAction("INSPIRED")}
            />
            <ToggleIcon
              icon={HandsPrayingIcon}
              tooltip="Thanks"
              active={thanksActive}
              onClick={() => handleAction("THANKS")}
            />
          </div>

          <div className="min-w-7 text-center font-medium text-gray-500">
            <TooltipWrapper
              tooltip={`Time${curationsCount < 1 ? "" : "s"} curated`}
            >
              <span>{curationsCount}</span>
            </TooltipWrapper>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
