// src/app/panel/contents/update/[id]/page.tsx
"use client";

import type { ContentSchema } from "@/lib/validations/content";
import axios from "axios";
import { use, useEffect, useState } from "react";

// UI Imports
import { PanelPageHeader } from "@/components/PanelPageHeader";
import ContentForm from "../../ContentForm";
import { handleClientError } from "@/lib/handleClientError";

type ContentResponse = {
  title: string;
  categoryId: string;
  image: string;
  link?: string;
  description?: string;
  contentTags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
};

function mapContentResponseToFormValues(
  data: ContentResponse,
): Partial<ContentSchema> {
  return {
    title: data.title,
    categoryId: data.categoryId,
    image: data.image,
    link: data.link ?? "",
    description: data.description ?? "",
    tags: (data.contentTags ?? []).map((ct) => ({
      id: ct.tag.id,
      name: ct.tag.name,
    })),
  };
}

export default function UpdateContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [initialValues, setInitialValues] =
    useState<Partial<ContentSchema> | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await axios.get(`/api/contents/${id}`);
        const data: ContentResponse = res.data;

        setInitialValues(mapContentResponseToFormValues(data));
      } catch (err) {
        handleClientError(err, "Failed to fetch content.");
      }
    }

    if (id) {
      fetchContent();
    }
  }, [id]);

  return (
    <>
      <PanelPageHeader />

      <ContentForm mode="update" initialValues={initialValues} id={id} />
    </>
  );
}
