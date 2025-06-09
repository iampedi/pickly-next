// src/pages/ContentsPage.tsx
"use client";
import { API_URL } from "@/config/api";
import { contentTypes } from "@/constants/content-types";
import { cn } from "@/lib/utils";
import type { Content } from "@/types/contents";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
// UI Imports
import { Logo } from "@/components/Logo";
import { SubmitButton } from "@/components/SubmitButton";
import Loader from "@/components/theme/Loader";
import TooltipWrapper from "@/components/theme/TooltipWrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  CrownIcon,
  DotIcon,
  ExternalLinkIcon,
  FilePenLineIcon,
  LucideGalleryVerticalEnd,
  TagIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

export default function ContentsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Contents, setContents] = useState<Content[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 1.0,
      }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  function handleFilterClick(type: string | null) {
    setActiveType(type);
    setPendingScroll(true);
  }

  useEffect(() => {
    if (pendingScroll) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScroll(false);
    }
  }, [pendingScroll]);

  const getContentTypeMeta = (value: string) => {
    return contentTypes.find((c) => c.value === value);
  };

  useEffect(() => {
    setLoading(true);
    const fetchContents = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/contents`);
        const data: Content[] = await response.json();
        setContents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    fetchContents();
  }, []);

  const usedTypes = new Set<string>(Contents.map((c) => c.type));

  const filterItems = [
    { value: null, label: "All", icon: LucideGalleryVerticalEnd },
    ...contentTypes.filter((type) => usedTypes.has(type.value)),
  ];

  async function handleDelete(id: string) {
    try {
      await axios.delete(`${API_URL}/contents/${id}`);
      setContents(Contents.filter((c) => c.id !== id));
      toast.success("Content deleted successfully!");
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content. Please try again.");
    }
  }

  return (
    <div className={cn("_wrapper bg-white")}>
      <div ref={ref} className="h-1" />
      <div
        className={cn(
          "sticky top-0 z-20 flex items-center justify-between px-4",
          isStuck ? "border-b bg-white" : ""
        )}
      >
        {isStuck && <Logo className="hidden md:flex" />}

        <div
          className={cn(
            "_carousel mx-auto max-w-full bg-white md:max-w-4xl md:px-2.5"
          )}
        >
          <Carousel
            opts={{
              align: "center",
            }}
            className={cn(
              "w-full duration-300",
              isStuck ? "py-2 md:py-2.5" : "py-4 md:py-5"
            )}
          >
            <CarouselContent>
              {filterItems.length === 1 ? (
                <span className="text-gray-400">No content found</span>
              ) : (
                filterItems.map((type) => {
                  const Icon = type.icon;

                  return (
                    <CarouselItem
                      key={type.value}
                      className={cn("basis-2/5 md:basis-auto")}
                      onClick={() => handleFilterClick(type.value)}
                    >
                      <div
                        className={cn(
                          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-gray-300 bg-gray-50/50 p-2 duration-300 hover:text-rose-600 md:h-12 md:flex-row md:border-white md:bg-white md:px-4 md:hover:border-gray-200/70 md:hover:bg-gray-50",
                          activeType === type.value &&
                            "border font-semibold text-rose-600 md:border-gray-200/70 md:bg-gray-50"
                        )}
                      >
                        <Icon size={20} /> {type.label}
                      </div>
                    </CarouselItem>
                  );
                })
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {isStuck && <SubmitButton className="hidden md:flex" />}
      </div>

      <div className="_content mb-8">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-6 flex items-center gap-2 text-2xl font-medium text-lime-600 md:mt-6 md:px-6">
            <CrownIcon size={22} />
            Latest Contents
          </h1>

          <div className="grid gap-4">
            {loading && <Loader />}

            {!loading && Contents.length === 0 && (
              <div className="flex items-center px-6 text-lg text-gray-500">
                There are no contents yet.
              </div>
            )}

            {Contents.slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .filter((content) => !activeType || content.type === activeType)
              .map((content) => {
                const meta = getContentTypeMeta(content.type);
                const Icon = meta?.icon;

                return (
                  <div
                    key={content.id}
                    className="group flex flex-col justify-between gap-6 rounded-lg border border-lime-300/70 bg-lime-50/70 p-4 duration-300 md:flex-row md:items-center md:border-white md:bg-white md:px-6 md:py-5 md:hover:border-lime-300 md:hover:bg-lime-50/50"
                  >
                    <div className="space-y-2">
                      <h2 className="flex items-center gap-2.5 text-lg font-medium group-hover:text-rose-600">
                        {Icon && (
                          <TooltipWrapper tooltip={meta?.label}>
                            <Icon size={20} />
                          </TooltipWrapper>
                        )}
                        {content.title}
                        {content.link && (
                          <TooltipWrapper tooltip="Open Link">
                            <a href={content.link} target="_blank">
                              <ExternalLinkIcon
                                size={16}
                                className="group-hover:text-gray-500 hover:text-black md:text-white"
                              />
                            </a>
                          </TooltipWrapper>
                        )}
                      </h2>

                      {content.tags?.length > 0 && (
                        <div className="flex items-center gap-2.5 capitalize">
                          <TagIcon size={16} className="text-gray-600" />
                          <div className="flex">
                            {content.tags.map((tag, index) => (
                              <Fragment key={tag}>
                                <span className="flex items-center gap-1 text-sm">
                                  {tag}
                                </span>

                                {index < content.tags.length - 1 && (
                                  <DotIcon
                                    size={18}
                                    className="text-gray-300"
                                  />
                                )}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {content.description && (
                        <p className="text-gray-600">{content.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-gray-400 drop-shadow-blue-300 md:hidden md:group-hover:flex">
                      <TooltipWrapper tooltip="Edit Content">
                        <FilePenLineIcon
                          className="cursor-pointer text-lime-600 md:hover:text-lime-600"
                          size={20}
                          onClick={() => router.push(`/contents/update/${content.id}`)}
                        />
                      </TooltipWrapper>
                      <TooltipWrapper tooltip="Delete Content">
                        <Trash2Icon
                          className="cursor-pointer text-red-600 md:hover:text-red-600"
                          size={20}
                          onClick={() => handleDelete(content.id)}
                        />
                      </TooltipWrapper>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
