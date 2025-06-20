// src/app/panel/curations/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Curation } from "@/types/curation";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// UI Imports
import { CurationCard } from "@/app/(site)/components/CurationCard";
import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";

export default function PanelCurationPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [curations, setCurations] = useState<Curation[]>([]);
  const { user } = useAuth();

  const getContentCategoryMeta = (value: string) => {
    return categories.find((c) => c.value === value);
  };

  // Fetch Curations
  useEffect(() => {
    if (!user) return;

    const fetchCurations = async () => {
      setLoading(true);

      const fetchCategories = async () => {
        try {
          const res = await axios.get("/api/categories");
          setCategories(res.data);
        } catch (err) {
          handleClientError(err, "Failed to fetch categories.");
        }
      };

      fetchCategories();

      try {
        const params = user.role === "CURATOR" ? { userId: user.id } : {};
        const res = await axios.get(`/api/curations`, { params });
        const data = res.data;

        setCurations(data);
        setLoading(false);
      } catch (err) {
        handleClientError(err, "Failed to fetch curations.");
      }
    };
    fetchCurations();
  }, [user, categories]);

  // Delete Curation
  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/curations/${id}`);
      setCurations(curations.filter((c) => c.id !== id));
      toast.success("Curation deleted successfully!");
    } catch (err) {
      handleClientError(err, "Failed to delete curation.");
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader>
        <SubmitButton href="/panel/curations/create" />
      </PanelPageHeader>

      <div className="_curations-list mb-10 flex flex-col gap-3">
        {curations.length === 0 && (
          <p className="text-center text-gray-400">No curations found.</p>
        )}

        {curations
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((curation) => {
            const meta = getContentCategoryMeta(
              curation.content?.category || "",
            );
            const Icon = meta?.icon;

            return (
              user && (
                <CurationCard
                  key={curation.id}
                  curation={curation}
                  currentUser={user}
                  Icon={Icon}
                  meta={meta}
                  handleDelete={handleDelete}
                />
              )
            );
          })}
      </div>
    </div>
  );
}
