// src/app/(site)/explore/page.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";
import type { Content } from "@/types/content";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import { HomeContentCard } from "@/app/(site)/components/HomeContentCard";
import { ContentCategoryFilter } from "@/components/ContentCategoryFilter";
import Loader from "@/components/Loader";

export default function ExplorePage() {
  const [loading, setLoading] = useState(false);
  const [, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchCategories = async (): Promise<void> => {
      try {
        const res = await axios.get(`/api/categories`);
        const categoriesData: Category[] = res.data;
        setCategories(categoriesData);
      } catch (err) {
        handleClientError(err, "Failed to fetch categories.");
      }
    };

    fetchCategories();

    const fetchContents = async (): Promise<void> => {
      try {
        const res = await axios.get(`/api/contents`);
        const contentsData: Content[] = res.data;
        setContents(contentsData);

        const filteredContents = contentsData.filter(
          (c) => !activeCategory || c.category?.id === activeCategory,
        );
        setFilteredContents(filteredContents);
      } catch (err) {
        handleClientError(err, "Failed to fetch contents.");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [activeCategory]);

  const usedCategories = Array.from(
    new Map(contents.map((c) => [c.category?.id, c.category])).values(),
  );

  return (
    <div className="flex flex-1 flex-col">
      <ContentCategoryFilter
        filterItems={usedCategories}
        activeCategory={activeCategory}
        setActiveCategory={(categoryId) => setActiveCategory(categoryId)}
      />

      <div className="_content flex flex-1 flex-col">
        <div className="container mx-auto flex max-w-5xl flex-1 flex-col px-3">
          {loading ? (
            <Loader />
          ) : (
            <div className="grid flex-1 grid-cols-2 content-start gap-3 md:grid-cols-4 md:gap-5">
              {!loading && contents.length === 0 && (
                <div className="col-span-2 flex flex-1 items-center justify-center text-gray-500">
                  There are no contents to show.
                </div>
              )}

              {filteredContents
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                // .filter((content) => !activeType || content.type === activeType)
                .map((content) => {
                  return <HomeContentCard key={content.id} content={content} />;
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
