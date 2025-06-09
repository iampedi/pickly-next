// src/app/contents/update/page.tsx
"use client";
import { API_URL } from "@/config/api";
import type { Content } from "@/types/contents";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
// UI Imports
import image from "@/assets/images/submit-01.webp";
import { Button } from "@/components/theme/Button";
import Loader from "@/components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import ContentForm from "../../Form";

export default function UpdateContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [initialValues, setInitialValues] = useState<Partial<Content> | null>(
    null
  );

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await axios.get(`${API_URL}/contents/${id}`);
        const data = res.data;

        setInitialValues({
          title: data.title,
          type: typeof data.type === "string" ? data.type : data.type.value,
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
    <main className="flex flex-col gap-6 overflow-hidden md:h-screen md:flex-row">
      <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-lime-100 to-white px-4 pt-6 md:w-1/2 md:gap-5 md:bg-gradient-to-r">
        <Image
          src={image}
          alt="Update Page"
          className="max-h-[65vw] object-contain md:w-80"
          priority
        />
        <h1 className="text-2xl font-medium text-yellow-900 md:text-3xl">
          Update Your Content
        </h1>
      </div>

      <div className="scrollbar-thin scrollbar-thumb-lime-400 scrollbar-track-lime-100 flex flex-col justify-between overflow-y-scroll px-4 md:w-1/2 md:p-8">
        <ContentForm mode="update" initialValues={initialValues} id={id} />

        <div className="my-4 text-center md:my-0">
          <Button
            variant={"link"}
            className="h-0 bg-red-100 !p-0 font-normal text-gray-500 hover:text-black"
            asChild
          >
            <Link href="/">
              <ArrowLeftIcon /> Back
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
