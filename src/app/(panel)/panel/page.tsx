// src/app/panel/page.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Content, User } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import { PanelHomeModule } from "@/components/PanelHomeModule";

export default function PanelPage() {
  const [loading, setLoading] = useState(false);
  const [curators, setCurators] = useState<number>(0);
  const [curations, setCurations] = useState<number>(0);
  const [categories, setCategories] = useState<number>(0);
  const [contents, setContents] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [curatorsRes, curationsRes, contentsRes] = await Promise.all([
          axios.get("/api/users"),
          axios.get("/api/curations"),
          axios.get("/api/contents"),
        ]);

        const curatorsCount = curatorsRes.data.filter(
          (user: User) => user.role === "CURATOR",
        ).length;
        setCurators(curatorsCount);

        const curationsCount = curationsRes.data.length;
        setCurations(curationsCount);

        const categoriesCount = Array.from(
          new Set(
            contentsRes.data
              .map((content: Content) => content.categoryId)
              .filter(Boolean),
          ),
        ).length;
        setCategories(categoriesCount);

        const contentsCount = contentsRes.data.length;
        setContents(contentsCount);
      } catch (err) {
        handleClientError(err, "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-4 flex-1 md:pt-0">
      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <PanelHomeModule title="Curators" value={curators} loading={loading} />

        <PanelHomeModule
          title="Curations"
          value={curations}
          loading={loading}
        />

        {/* <PanelHomeModule title="Actions" value={12} /> */}

        <PanelHomeModule
          title="Categories"
          value={categories}
          loading={loading}
        />

        <PanelHomeModule title="Contents" value={contents} loading={loading} />
      </div>
    </div>
  );
}
