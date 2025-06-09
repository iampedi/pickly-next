// src/app/contents/create/page.tsx
import Image from "next/image";
import Link from "next/link";
// UI Imports
import image from "@/assets/images/submit-01.webp";
import { Button } from "@/components/theme/Button";
import { ArrowLeftIcon } from "lucide-react";
import ContentForm from "../Form";

export default function CreateContentPage() {
  return (
    <main className="flex flex-col gap-6 overflow-hidden md:h-screen md:flex-row">
      <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-lime-100 to-white px-4 pt-6 md:w-1/2 md:gap-5 md:bg-gradient-to-r">
        <Image
          src={image}
          alt="Create Page"
          className="max-h-[65vw] object-contain md:w-80"
        />
        <h1 className="text-2xl font-medium text-yellow-900 md:text-3xl">
          Submit Your Content
        </h1>
      </div>

      <div className="scrollbar-thin scrollbar-thumb-lime-400 scrollbar-track-lime-100 flex flex-col justify-between overflow-y-scroll px-4 md:w-1/2 md:p-8">
        <ContentForm mode="create" />

        <div className="my-4 text-center md:my-0">
          <Button
            variant={"link"}
            className="h-0 bg-red-100 !p-0 font-normal text-gray-500 hover:text-black"
            asChild
          >
            <Link href="/">
              <ArrowLeftIcon /> Back
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
