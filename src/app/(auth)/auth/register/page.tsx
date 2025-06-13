// src/app/auth/register/page.tsx
"use client";
import { Logo } from "@/components/Logo";
import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-lime-50 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Logo className="mb-6 justify-center" />
        <RegisterForm />
      </div>
    </div>
  );
}
