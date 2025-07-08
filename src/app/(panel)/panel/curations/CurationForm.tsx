"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { handleClientError } from "@/lib/handleClientError";
import { getDefaultCurationValues } from "@/lib/validations/curation";

import { Button } from "@/components/theme/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/theme/form";
import { Input } from "@/components/theme/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/theme/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import {
  curationFormSchema,
  CurationFormSchema,
} from "@/lib/validations/curation/formSchema";
import { Category, Content } from "@/types";

type CurationFormProps = {
  mode?: "create" | "update";
  initialValues?: Partial<CurationFormSchema>;
  id?: string;
};

type Suggestion = {
  id: string;
  title: string;
};

export default function CurationForm({
  mode,
  initialValues,
  id,
}: CurationFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ======= Load categories =======
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (Array.isArray(res.data) && isMounted) {
          setCategories(res.data);
        }
      } catch (err) {
        handleClientError(err, "Failed to fetch categories.");
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // ======= Fetch suggestions =======
  const fetchSuggestions = async (title: string, categoryId: string) => {
    if (!title || !categoryId) return;

    try {
      const res = await axios.get<Content[]>("/api/contents", {
        params: {
          categoryId,
          title,
        },
      });
      setSuggestions(res.data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  // ======= Handle suggestion click =======
  const handleSuggestionClick = (s: Suggestion) => {
    form.setValue("title", s.title);
    form.setValue("contentId", s.id);
    setShowSuggestions(false);
  };

  // ======= Use Form =======
  const form = useForm<CurationFormSchema>({
    resolver: zodResolver(curationFormSchema),
    defaultValues: initialValues ?? getDefaultCurationValues(),
  });

  // ======= Submit Form =======
  const onSubmit = async (values: CurationFormSchema) => {
    setLoading(true);

    try {
      // ===== Update Mode: Update curation =====
      if (mode === "update" && id) {
        await axios.put(`/api/curations/${id}`, {
          comment: values.comment,
        });
        toast.success("Curation updated successfully.");
        router.push("/panel/curations");
        return;
      }
      let contentId = values.contentId || null;

      // ===== Create Mode =====
      // === 1. Check if curation already exists for this user/content ===
      const existingCurationRes = await axios.get("/api/curations/check", {
        params: {
          title: values.title,
          categoryId: values.categoryId,
          userId: user?.id,
        },
      });

      if (existingCurationRes.data.exists) {
        toast.error("You have already curated this content.");
        return;
      }

      // === 2. Try to find existing content by title/category ===
      const contentRes = await axios.get<Content[]>("/api/contents", {
        params: {
          title: values.title,
          categoryId: values.categoryId,
        },
      });

      if (Array.isArray(contentRes.data) && contentRes.data.length > 0) {
        contentId = contentRes.data[0].id;
      }

      // === 3. If content doesn't exist, create it ===
      if (!contentId) {
        const createContentRes = await axios.post("/api/contents", {
          title: values.title,
          categoryId: values.categoryId,
          image: "/images/content-placeholder.webp",
          description: "",
          link: "",
          contentTags: [],
          tags: [],
        });
        contentId = createContentRes.data.id;
      }

      // === 4. Finally, create the curation if contentId exists ===
      if (contentId) {
        await axios.post("/api/curations", {
          contentId,
          comment: values.comment,
          userId: user?.id,
        });

        toast.success("Curation created successfully.");
        router.push("/panel/curations");
      } else {
        toast.error("Error: Content ID not found!");
      }
    } catch (err) {
      handleClientError(err, "Failed to create curation.");
    } finally {
      setLoading(false);
    }
  };

  // log in dev mode to console

  return (
    <div className="container mx-auto mt-6 max-w-lg flex-1">
      <Card>
        <CardHeader>
          <CardDescription>
            {mode === "update"
              ? "Edit your personal note for this curation."
              : "Curate a content: Select type and title, add your note (optional), and submit."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-3 md:grid-cols-2"
            >
              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("title", "");
                        form.setValue("contentId", undefined);
                        setSuggestions([]);
                      }}
                      value={field.value}
                      disabled={mode === "update"}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue("contentId", undefined);
                          fetchSuggestions(
                            e.target.value,
                            form.getValues("categoryId"),
                          );
                        }}
                        onFocus={() => {
                          if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        disabled={mode === "update"}
                      />
                    </FormControl>
                    <FormMessage />
                    {mode === "create" &&
                      showSuggestions &&
                      suggestions.length > 0 && (
                        <div className="absolute top-16 z-10 max-h-56 w-full overflow-y-auto rounded-lg border bg-white text-sm shadow-lg">
                          {suggestions.map((s) => (
                            <div
                              key={s.id}
                              className="cursor-pointer px-3 py-2 capitalize hover:bg-gray-100"
                              onClick={() => handleSuggestionClick(s)}
                            >
                              {s.title}
                            </div>
                          ))}
                        </div>
                      )}
                  </FormItem>
                )}
              />

              {/* Comment */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Your Note{" "}
                      <span className="text-xs text-gray-400">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your opinion on this content"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="mt-2 flex flex-col-reverse items-center gap-3 md:flex-row">
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/panel/curations">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="w-full md:col-span-2"
                  // disabled={loading || (mode === "create" && isDuplicate)}
                >
                  {loading ? (
                    <>
                      <CircleNotchIcon className="animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {mode === "update"
                        ? "Update Curation"
                        : "Submit Curation"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
