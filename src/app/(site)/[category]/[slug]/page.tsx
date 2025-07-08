// src/app/(site)/[category]/[slug]/page.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Content } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// UI Imports
import { ContentCurations } from "@/app/(site)/components/ContentCurations";
import { ContentDetails } from "@/app/(site)/components/ContentDetails";
import Loader from "@/components/Loader";

export default function ContentDetailPage() {
  const { slug, category } = useParams();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    if (!slug || !category) return;

    const fetchContent = async () => {
      try {
        const res = await axios.get(`/api/${category}/${slug}`);
        setContent(res.data);
      } catch (err) {
        handleClientError(err, "Failed to fetch content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, category]);

  if (loading) {
    return <Loader />;
  }

  if (!content) {
    return (
      <div className="_page py-6">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div>Content not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="_page border-t border-gray-200/75 py-6">
      <div className="container mx-auto h-full max-w-5xl px-4">
        <div className="_wrapper flex flex-col gap-5 md:flex-row">
          <div className="md:w-1/2 md:border-r md:pr-5">
            <ContentDetails content={content} />
          </div>
          <div className="_content flex flex-col gap-5 border-t pt-5 md:w-1/2 md:gap-3 md:border-t-0 md:pt-0">
            {content.curations.map((item) => (
              <ContentCurations key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
