// src/app/panel/curations/update/[id]/page.tsx
"use client";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import ContentCurationForm from "../../CurationForm";
import { PanelPageHeader } from "@/components/PanelPageHeader";

type InitialValues = {
  type: string;
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
        // فرض بر این است که API زیر content را هم populate می‌کند
        const res = await axios.get(`/api/curations/${id}`);
        const data = res.data;

        setInitialValues({
          // مقداردهی اولیه بر اساس داده‌های curation و content
          type: data.content?.type || "",
          title: data.content?.title || "",
          comment: data.comment || "",
        });
      } catch (error) {
        console.error("Error fetching curation:", error);
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
