// src/app/(site)/explore/page.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";
import type { Content } from "@/types/content";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

// UI Imports
import { ContentCard } from "@/app/(site)/components/ContentCard";
import { ContentCategoryFilter } from "@/app/(site)/components/ContentCategoryFilter";
import Loader from "@/components/Loader";

export default function ExplorePage() {
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>("");

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/contents");
        const curatedContents = res.data.filter(
          (c: Content) => c.curationsCount > 0,
        );
        setContents(curatedContents);
      } catch (err) {
        handleClientError(err, "Failed to fetch contents.");
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  const usedCategories = useMemo(
    () =>
      Array.from(
        new Map(contents.map((c) => [c.category?.id, c.category])).values(),
      ).filter(Boolean),
    [contents],
  );

  const filteredContents = useMemo(() => {
    if (!activeCategory) return contents;
    return contents.filter((c) => c.category?.id === activeCategory);
  }, [contents, activeCategory]);

  const categoriesWithAll = [
    { id: "", label: "All", icon: "FolderIcon" },
    ...usedCategories,
  ];

  if (loading) return <Loader />;

  return (
    <div className="_explore-page flex flex-1 flex-col">
      <div className="container mx-auto h-full max-w-5xl px-4">
        {filteredContents.length > 0 && (
          <ContentCategoryFilter
            filterItems={categoriesWithAll as Category[]}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        )}

        <div className="_content flex flex-1 flex-col py-4">
          <div className="grid flex-1 content-start gap-3 md:grid-cols-3 md:gap-5">
            {filteredContents.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center text-gray-500 md:col-span-4">
                There are no contents to show.
              </div>
            ) : (
              filteredContents
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((content) => {
                  return <ContentCard key={content.id} content={content} />;
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
