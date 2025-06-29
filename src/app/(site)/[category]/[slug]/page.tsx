// src/app/(site)/[category]/[slug]/page.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Content } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// src/app/(site)/[category]/[slug]/page.tsx
export default function ContentDetailPage() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const slug = useParams().slug;
  const category = useParams().category;

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
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

  return (
    <div className="_page border-t border-gray-200/75 py-6">
      <div className="container mx-auto h-full max-w-5xl px-4">
        <div className="_wrapper flex h-full flex-col">
          {loading && <div>Loading...</div>}
          {content && (
            <div className="_content flex flex-1 flex-col content-around items-center justify-center gap-8 px-2 pt-6 pb-12 md:flex-row md:gap-10 md:px-0 md:py-20">
              <div className="md:w-2/3">
                <h2 className="mb-2 text-[26px] font-semibold md:mb-4 md:text-[40px] md:font-medium">
                  {content.title}
                </h2>
                <div className="space-y-3 text-xl text-gray-600 md:text-2xl md:leading-9">
                  <p>{content.description}</p>
                </div>
              </div>
              <div className="md:w-1/3">
                <Image
                  src={content.image}
                  width={300}
                  height={446}
                  alt={content.title}
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
