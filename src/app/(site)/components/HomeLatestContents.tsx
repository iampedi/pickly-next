// src/app/(site)/components/HomeLatestContents.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Content } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import Loader from "@/components/Loader";
import { ClockClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import { ContentCard } from "./ContentCard";
import { Button } from "@/components/theme/button";
import Link from "next/link";

export const HomeLatestContents = () => {
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    setLoading(true);

    const fetchContents = async () => {
      try {
        const res = await axios.get("/api/contents");
        const latestContents = res.data
          .sort(
            (a: Content, b: Content) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 4);

        setContents(latestContents);
      } catch (err) {
        handleClientError(err, "Failed to fetch contents.");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  return (
    <div className="py-8 md:py-10">
      <div className="continer mx-auto h-full max-w-5xl px-4">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-medium text-lime-700">
          <ClockClockwiseIcon size={28} /> Latest Contents
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {loading && <Loader className="col-span-2 md:col-span-4" />}

          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <Link href="/explore">Explore All Contents</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
