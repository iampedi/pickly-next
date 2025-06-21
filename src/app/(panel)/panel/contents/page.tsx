// src/app/panel/contents/page.tsx
"use client";

import { Content } from "@/types/content";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import { ContentTable } from "@/app/(panel)/components/ContentTable";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/theme/input";
import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";
import { toast } from "sonner";

export default function PanelContentPage() {
  const [loading, setLoading] = useState(false);
  const [, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  // Log in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Contents:", contents);
    }
  }, [contents]);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader>
        <div className="flex w-full flex-1 items-center justify-end gap-2 md:gap-4">
          <Input
            placeholder="Search..."
            className="w-full md:max-w-3xs focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SubmitButton href="/panel/contents/create" />
        </div>
      </PanelPageHeader>

      <div className="_contents-list mb-10 flex flex-col gap-3">
        <ContentTable
          // key={content.id}
          searchTerm={searchTerm}
          contents={contents}
          handleDelete={handleDelete}
          isLoading={loading}
        />

        {/* {contents.length === 0 && (
          <div className="flex items-center justify-center">
            <p className="text-gray-400">No content found.</p>
          </div>
        )}

        {contents
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((content) => {
            return (
              <ContentCard
                key={content.id}
                content={content}
                handleDelete={handleDelete}
              />      
            );
          })} */}
      </div>
    </div>
  );
}
