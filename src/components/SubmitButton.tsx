// src/components/SubmitButton.tsx
"use client";
import Link from "next/link";
import { Button } from "./theme/button";
import { PlusCircleIcon } from "@phosphor-icons/react/dist/ssr";

type SubmitButtonProps = {
  className?: string;
  href: string;
};

export const SubmitButton = ({ className, href }: SubmitButtonProps) => {
  return (
    <Button className={className} variant={"outline"} asChild>
      <Link href={href || "#"}>
        <PlusCircleIcon weight="duotone" /> Submit
      </Link>
    </Button>
  );
};
