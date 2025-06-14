// src/app/panel/curations/page.tsx
"use client";

import { contentTypes } from "@/constants/conent-types";
import { useAuth } from "@/contexts/AuthContext";
import { Curation } from "@/types/curations";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// UI Imports
import { CurationCard } from "@/app/layout/CurationCard";
import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { handleClientError } from "@/lib/handleClientError";

export default function PanelCurationPage() {
  const [loading, setLoading] = useState(false);
  const [curations, setCurations] = useState<Curation[]>([]);
  const { user } = useAuth();

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
      } catch (err) {
        handleClientError(err, "Failed to fetch curations.");
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
            const meta = getContentTypeMeta(curation.content?.type || "");
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
