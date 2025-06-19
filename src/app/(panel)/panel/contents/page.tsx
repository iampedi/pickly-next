// src/app/panel/contents/page.tsx
"use client";

import { Content } from "@/types/content";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import { ContentCard } from "@/app/(panel)/components/ContentCard";
import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { toast } from "sonner";
import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";

export default function PanelContentPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);

  const getContentTypeMeta = (value: string) => {
    return categories.find((c) => c.value === value);
  };

  // Fetch Contents
  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);

      const fetchCategories = async () => {
        try {
          const res = await axios.get("/api/categories");
          setCategories(res.data);
        } catch (err) {
          handleClientError(err, "Failed to fetch categories.");
        }
      };

      fetchCategories();

      try {
        const res = await axios.get(`/api/contents`);
        const data = res.data;

        setContents(data);
        setLoading(false);
      } catch (error) {
        handleClientError(error, "Failed to fetch contents.");
      }
    };
    fetchContents();
  }, []);

  // Delete Content
  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/contents/${id}`);
      setContents(contents.filter((c) => c.id !== id));
      toast.success("Content deleted successfully!");
    } catch (error) {
      handleClientError(error, "Failed to delete content.");
    }
  }

  useEffect(() => {
    console.log(" Pedram is watching contents", contents);
  }, [contents]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader>
        <SubmitButton href="/panel/contents/create" />
      </PanelPageHeader>

      <div className="_contents-list mb-10 flex flex-col gap-3">
        {contents.length === 0 && (
          <div className="flex items-center justify-center">
            <p className="text-gray-400">No content found.</p>
          </div>
        )}

        {contents
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          // .filter((content) => !activeType || content.type === activeType)
          .map((content) => {
            const meta = getContentTypeMeta(content.category);
            const Icon = meta?.icon;

            return (
              <ContentCard
                key={content.id}
                content={content}
                Icon={Icon}
                meta={meta}
                handleDelete={handleDelete}
              />
            );
          })}
      </div>
    </div>
  );
}
