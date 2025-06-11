// src/app/panel/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PanelPage() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("login") === "true") {
      toast.success("Login successful!");
    }
  }, [params]);

  return (
    <div className="">
      <div className="">test</div>
    </div>
  );
}
