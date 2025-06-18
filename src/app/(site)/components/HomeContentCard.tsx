// src/app/layout/Conten
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Content } from "@/types/contents";
import axios from "axios";
import { ComponentType, useEffect, useState } from "react";

// UI Imports
import { ToggleIcon } from "@/components/theme/ToggleIcon";
import { TooltipWrapper } from "@/components/theme/TooltipWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import {
  BookmarkIcon,
  HandsPrayingIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

type Meta = {
  label: string;
};

type ContentCardProps = {
  content: Content;
  Icon?: ComponentType<IconProps>;
  meta?: Meta;
  handleDelete?: (id: string) => void;
  onChangeBookmark?: () => void;
};

export const HomeContentCard = ({
  onChangeBookmark,
  content,
  Icon,
  meta,
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

  if (loading) return null;

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
            <strong>{content.curations?.length || 0}</strong> time
            {content.curations?.length === 1 ? "" : "s"} curated.
          </div>
        </div>

        {content.description && (
          <p className="line-clamp-1 text-gray-400 group-hover:text-lime-800">
            {content.description}
          </p>
        )}

        <div className="mt-2 flex h-6 items-center justify-end">
          <div>
            <div className="animate-in flex items-center gap-4 text-gray-400 duration-300 group-hover:text-lime-800">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
