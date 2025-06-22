// src/app/panel/curations/update/[id]/page.tsx
"use client";

import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import axios from "axios";
import { use, useEffect, useState } from "react";
import ContentCurationForm from "../../CurationForm";
import { handleClientError } from "@/lib/handleClientError";

type InitialValues = {
  categoryId: string;
  title: string;
  comment?: string;
};

export default function UpdateCurationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [initialValues, setInitialValues] = useState<InitialValues | null>(
    null,
  );

  useEffect(() => {
    async function fetchCuration() {
      try {
        const res = await axios.get(`/api/curations/${id}`);
        const data = res.data;

        setInitialValues({
          categoryId: data.content?.categoryId || "",
          title: data.content?.title || "",
          comment: data.comment || "",
        });
      } catch (err) {
        handleClientError(err, "Failed to fetch curation.");
      }
    }

    if (id) {
      fetchCuration();
    }
  }, [id]);

  if (!initialValues) {
    return <Loader />;
  }

  return (
    <>
      <PanelPageHeader />
      <ContentCurationForm
        mode="update"
        initialValues={initialValues}
        id={id}
      />
    </>
  );
}
