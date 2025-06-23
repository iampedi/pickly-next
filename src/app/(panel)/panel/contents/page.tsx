// src/app/panel/contents/page.tsx
"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Category } from "@/types";
import { Content } from "@/types/content";
import axios from "axios";
import { useEffect, useState } from "react";

// UI Imports
import { ContentTable } from "@/app/(panel)/components/ContentTable";
import { PanelPageHeader } from "@/app/(panel)/components/PanelPageHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/theme/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/theme/select";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/DeleteDialog";

export default function PanelContentPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const availableCategories = Array.from(
    new Set(
      contents
        .map((c) => c.category?.label)
        .filter(
          (label): label is string => !!label && typeof label === "string",
        ),
    ),
  );

  const filteredCategoriesWithContent = categories.filter(
    (cat): cat is Category =>
      !!cat &&
      typeof cat === "object" &&
      "label" in cat &&
      typeof cat.label === "string" &&
      availableCategories.includes(cat.label),
  );

  // ======= Fetch Contents =======
  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);

      const fetchCategories = async () => {
        try {
          const res = await axios.get("/api/categories");
          setCategories(res.data);
        } catch (err) {
          handleClientError(err, "Failed to fetch categories.");
        }
      };

      fetchCategories();

      try {
        const res = await axios.get(`/api/contents`);
        const data = res.data;

        setContents(data);
        setLoading(false);
      } catch (error) {
        handleClientError(error, "Failed to fetch contents.");
      }
    };
    fetchContents();
  }, []);

  // ======= Delete Content =======
  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/contents/${id}`);
      setContents(contents.filter((c) => c.id !== id));
      toast.success("Content deleted successfully!");
    } catch (error) {
      handleClientError(error, "Failed to delete content.");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PanelPageHeader>
        <div className="flex w-full flex-1 flex-wrap items-center justify-between gap-2 md:justify-end md:gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="order-1 w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filteredCategoriesWithContent.map((cat) => (
                <SelectItem key={cat.id} value={cat.label}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search..."
            className="order-3 w-full focus-visible:ring-0 md:order-2 md:max-w-3xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SubmitButton href="/panel/contents/create" className="order-2" />
        </div>
      </PanelPageHeader>

      <div className="_contents-list mb-10 flex flex-col gap-3">
        <ContentTable
          searchTerm={searchTerm}
          contents={contents}
          isLoading={loading}
          categoryFilter={categoryFilter}
          onRequestDelete={(id: string) => {
            setSelectedId(id);
            setOpen(true);
          }}
        />
      </div>

      <DeleteDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelectedId(null);
        }}
        handleDelete={(id) => {
          handleDelete(id);
          setOpen(false);
          setSelectedId(null);
        }}
        id={selectedId!}
      />
    </div>
  );
}
