// src/components/SubmitButton.tsx
import Link from "next/link";
import { Button } from "./theme/Button";
import { PlusCircleIcon } from "@phosphor-icons/react/dist/ssr";

type SubmitButtonProps = {
  className?: string;
};

export const SubmitButton = ({ className }: SubmitButtonProps) => {
  return (
    <Button className={className} variant={"outline"} size={"lg"} asChild>
      <Link href="/panel/contents/create">
        <PlusCircleIcon weight="duotone" /> Submit
      </Link>
    </Button>
  );
};
