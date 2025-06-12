// src/app/panel/page.tsx
"use client";
import Loader from "@/components/Loader";
import { PanelPageHeader } from "@/components/PanelPageHeader";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

export default function PanelPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PanelPageContent />
    </Suspense>
  );
}

function PanelPageContent() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("login") === "true") {
      toast.success("Login successful!");
    }
  }, [params]);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader />
    </div>
  );
}
