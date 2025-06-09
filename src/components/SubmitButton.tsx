// src/components/SubmitButton.tsx
import Link from "next/link";
import { Button } from "./theme/Button";
import { CirclePlusIcon } from "lucide-react";

type SubmitButtonProps = {
  className?: string;
};

export const SubmitButton = ({ className }: SubmitButtonProps) => {
  return (
    <Button className={className} variant={"outline"} size={"lg"} asChild>
      <Link href="/contents/create">
        <CirclePlusIcon /> Submit
      </Link>
    </Button>
  );
};
