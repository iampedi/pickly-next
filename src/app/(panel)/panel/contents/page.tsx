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

  // ======= Fetch Contents =======
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

  // ======= Delete Content =======
  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/contents/${id}`);
      setContents(contents.filter((c) => c.id !== id));
      toast.success("Content deleted successfully!");
    } catch (error) {
      handleClientError(error, "Failed to delete content.");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader>
        <div className="flex w-full flex-1 items-center justify-end gap-2 md:gap-4">
          <Input
            placeholder="Search..."
            className="w-full focus-visible:ring-0 md:max-w-3xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SubmitButton href="/panel/contents/create" />
        </div>
      </PanelPageHeader>

      <div className="_contents-list mb-10 flex flex-col gap-3">
        <ContentTable
          searchTerm={searchTerm}
          contents={contents}
          handleDelete={handleDelete}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
