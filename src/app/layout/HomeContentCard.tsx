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

type Meta = {
  label: string;
};

type ContentCardProps = {
  content: Content;
  Icon?: ComponentType<IconProps>;
  meta?: Meta;
  handleDelete?: (id: string) => void;
};

export const HomeContentCard = ({ content, Icon, meta }: ContentCardProps) => {
  const [bookmarkActive, setBookmarkActive] = useState(false);
  const [inspiredActive, setInspiredActive] = useState(false);
  const [thanksActive, setThanksActive] = useState(false);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await axios.get("/api/action", {
          params: { contentId: content.id },
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

      if (type === "BOOKMARK") setBookmarkActive((v) => !v);
      if (type === "INSPIRED") setInspiredActive((v) => !v);
      if (type === "THANKS") setThanksActive((v) => !v);
    } catch (err) {
      handleClientError(err, "Failed to handle action.");
    }
  };

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
