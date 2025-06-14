// src/app/panel/bookmarks/page.tsx
"use client";

import { contentTypes } from "@/constants/conent-types";
import { Content } from "@/types/contents";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { ContentCard } from "../../layout/ContentCard";
import { handleClientError } from "@/lib/handleClientError";

export default function PanelBookmarksPage() {
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/bookmarks`);
        setContents(res.data);
      } catch (error) {
        handleClientError(error, "Failed to fetch bookmarks.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const getContentTypeMeta = (value: string) => {
    return contentTypes.find((c) => c.value === value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader />

      <div className="_contents-list mb-10 flex flex-col gap-3">
        {contents.length === 0 && (
          <div className="flex items-center justify-center">
            <p className="text-gray-400">No bookmark found.</p>
          </div>
        )}

        {contents
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((content) => {
            const meta = getContentTypeMeta(content.type);
            const Icon = meta?.icon;

            return (
              <ContentCard
                key={content.id}
                content={content}
                Icon={Icon}
                meta={meta}
              />
            );
          })}
      </div>
    </div>
  );
}
