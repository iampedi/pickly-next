// src/app/panel/curations/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Curation } from "@/types/curation";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// UI Imports
import { CurationCard } from "@/app/(site)/components/CurationCard";
import { PanelPageHeader } from "@/app/(panel)/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";
import { DeleteDialog } from "@/components/DeleteDialog";
import Loader from "@/components/Loader";

export default function PanelCurationPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [curations, setCurations] = useState<Curation[]>([]);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch Categories & Curations together
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch both in parallel
        const [catRes, curationRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/curations", {
            params: user?.role === "CURATOR" ? { userId: user.id } : {},
          }),
        ]);
        setCategories(catRes.data);
        setCurations(curationRes.data);
      } catch (err) {
        handleClientError(err, "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // Delete Curation
  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/curations/${id}`);
      setCurations((prev) => prev.filter((c) => c.id !== id));
      toast.success("Curation deleted successfully!");
    } catch (err) {
      handleClientError(err, "Failed to delete curation.");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader>
        <SubmitButton href="/panel/curations/create" />
      </PanelPageHeader>

      <div className="_curations-list mb-10 flex flex-col gap-3">
        {loading ? (
          <Loader />
        ) : curations.length === 0 ? (
          <p className="text-center text-gray-400">No curations found.</p>
        ) : (
          curations
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((curation) => {
              // Find related category object by categoryId
              const categoryId = curation.content?.categoryId;
              const category = categories.find((cat) => cat.id === categoryId);

              return (
                user &&
                category && (
                  <CurationCard
                    key={curation.id}
                    curation={curation}
                    currentUser={user}
                    category={category}
                    onRequestDelete={() => {
                      setSelectedId(curation.id);
                      setOpen(true);
                    }}
                  />
                )
              );
            })
        )}

        {selectedId && (
          <DeleteDialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) setSelectedId(null);
            }}
            handleDelete={(id) => {
              handleDelete(id);
              setOpen(false);
              setSelectedId(null);
            }}
            id={selectedId}
          />
        )}
      </div>
    </div>
  );
}
