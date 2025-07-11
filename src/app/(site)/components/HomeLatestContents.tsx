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
          .filter((content: Content) => content.curationsCount > 0)
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
      <div className="container mx-auto h-full max-w-5xl px-4">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-medium text-lime-700">
          <ClockClockwiseIcon size={28} /> Latest Contents
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {loading ? (
            <Loader className="col-span-2 md:col-span-4" />
          ) : contents.length > 0 ? (
            contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))
          ) : (
            <p className="col-span-2 text-center md:col-span-4">
              There are no contents to show.
            </p>
          )}
        </div>

        {contents.length > 4 && (
          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link href="/explore">Explore All Contents</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
