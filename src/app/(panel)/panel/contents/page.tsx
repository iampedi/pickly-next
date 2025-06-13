// src/app/panel/contents/page.tsx
"use client";
import { contentTypes } from "@/constants/conent-types";
import { Content } from "@/types/contents";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
// UI Imports
import { ContentCard } from "@/app/(panel)/layout/ContentCard";
import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { toast } from "sonner";

export default function PanelContentPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PanelContentPageContent />
    </Suspense>
  );
}

function PanelContentPageContent() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    if (params.get("submitted") === "true") {
      toast.success("Content submitted successfully!");
    } else if (params.get("updated") === "true") {
      toast.success("Content updated successfully!");
    }
  }, [params]);

  const getContentTypeMeta = (value: string) => {
    return contentTypes.find((c) => c.value === value);
  };

  // Fetch Contents
  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/contents`);
        const data = res.data;

        setContents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contents:", error);
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
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content. Please try again.");
    }
  }

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
            const meta = getContentTypeMeta(content.type);
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
