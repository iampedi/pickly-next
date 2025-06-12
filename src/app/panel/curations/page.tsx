// src/app/panel/curations/page.tsx
"use client";
import { contentTypes } from "@/constants/conent-types";
import { Curation } from "@/types/curations";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
// UI Imports
import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { toast } from "sonner";
import { CurationCard } from "@/app/layout/CurationCard";
import { useAuth } from "@/contexts/AuthContext";

export default function PanelCurationPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PanelCurationPageContent />
    </Suspense>
  );
}

function PanelCurationPageContent() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [curations, setCurations] = useState<Curation[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (params.get("submitted") === "true") {
      toast.success("Curation submitted successfully!");
    } else if (params.get("updated") === "true") {
      toast.success("Curation updated successfully!");
    }
  }, [params]);

  const getContentTypeMeta = (value: string) => {
    return contentTypes.find((c) => c.value === value);
  };

  // Fetch Curations
  useEffect(() => {
    if (!user) return;

    const fetchCurations = async () => {
      setLoading(true);
      try {
        const params = user.isCurator ? { userId: user.id } : {};
        const res = await axios.get(`/api/curations`, { params });
        const data = res.data;

        setCurations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching curations:", error);
      }
    };
    fetchCurations();
  }, [user]);

  // Delete Curation
  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/curations/${id}`);
      setCurations(curations.filter((c) => c.id !== id));
      toast.success("Curation deleted successfully!");
    } catch (error) {
      console.error("Error deleting curation:", error);
      toast.error("Failed to delete curation. Please try again.");
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
            const meta = getContentTypeMeta(curation.content?.type || "");
            const Icon = meta?.icon;

            return (
              <CurationCard
                key={curation.id}
                curation={curation}
                Icon={Icon}
                meta={meta}
                handleDelete={handleDelete}
              />
            );
          })}
      </div>
    </div>
  );
}
