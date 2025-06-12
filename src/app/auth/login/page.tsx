// src/app/auth/login/page.tsx
"use client";
import { Logo } from "@/components/Logo";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { LoginForm } from "./form";
import Loader from "@/components/Loader";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("registered") === "true") {
      toast.success("User registered successfully!");
    }
  }, [params]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-lime-50 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Logo className="mb-6 justify-center" />
        <LoginForm />
      </div>
    </div>
  );
}
