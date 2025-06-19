// src/app/panel/contents/update/[id]/page.tsx
"use client";
import type { Content } from "@/types/content";
import axios from "axios";
import { use, useEffect, useState } from "react";
// UI Imports
import Loader from "@/components/Loader";
import ContentForm from "../../ContentForm";
import { PanelPageHeader } from "@/components/PanelPageHeader";

export default function UpdateContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [initialValues, setInitialValues] = useState<Partial<Content> | null>(
    null,
  );

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await axios.get(`/api/contents/${id}`);
        const data = res.data;

        setInitialValues({
          title: data.title,
          type: data.type,
          link: data.link ?? "",
          tags: data.tags ?? [],
          description: data.description ?? "",
        });
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    }

    if (id) {
      fetchContent();
    }
  }, [id]);

  if (!initialValues) {
    return <Loader />;
  }

  return (
    <>
      <PanelPageHeader />

      <ContentForm mode="update" initialValues={initialValues} id={id} />
    </>
  );
}
