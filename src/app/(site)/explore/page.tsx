// src/app/(site)/explore/page.tsx
"use client";

import type { Content } from "@/types/content";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import { HomeContentCard } from "@/app/(site)/components/HomeContentCard";
import { ContentCategoryFilter } from "@/components/ContentCategoryFilter";
import Loader from "@/components/Loader";
import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";

export default function ExplorePage() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchCategories = async (): Promise<void> => {
      try {
        const res = await axios.get(`/api/categories`);
        const categoryData: Category[] = res.data;
        setCategory(categoryData);
      } catch (err) {
        handleClientError(err, "Failed to fetch categories.");
      }
    };

    fetchCategories();

    const fetchContents = async (): Promise<void> => {
      try {
        const res = await axios.get(`/api/contents`);
        const data: Content[] = res.data;
        setContents(data);
        setLoading(false);
      } catch (err) {
        handleClientError(err, "Failed to fetch contents.");
      }
    };

    fetchContents();
  }, []);

  // const getContentCategoryMeta = (value: string) => {
  //   return contentCategories.find((c) => c.value === value);
  // };

  // const usedTypes = new Set<string>(contents.map((c) => c.type));

  // const filterItems: Category[] = [
  //   { value: "", label: "All", icon: RowsIcon },
  //   ...contentCategories.filter((type) => usedTypes.has(type.value)),
  // ];

  return (
    <div className="flex flex-1 flex-col">
      {/* {filterItems.length > 1 && (
        <ContentCategoryFilter
          filterItems={filterItems}
          setActiveType={setActiveType}
        />
      )} */}

      <div className="_content flex flex-1 flex-col">
        <div className="container mx-auto flex max-w-5xl flex-1 flex-col px-3">
          {loading ? (
            <Loader />
          ) : (
            <div className="grid flex-1 grid-cols-2 gap-3 content-start md:gap-5 md:grid-cols-4">
              {!loading && contents.length === 0 && (
                <div className="col-span-2 flex flex-1 items-center justify-center text-gray-500">
                  There are no contents to show.
                </div>
              )}

              {contents
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
