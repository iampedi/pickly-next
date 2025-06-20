"use client";

import { handleClientError } from "@/lib/handleClientError";
import { Category, TagInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  contentSchema,
  getDefaultContentValues,
  ContentSchema,
} from "@/lib/validations/content";

import Loader from "@/components/Loader";
import { Button } from "@/components/theme/Button";
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
import { TagsInput } from "@/components/theme/TagsInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";

type ContentFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<ContentSchema>;
  id?: string;
};

export default function ContentForm({
  mode,
  initialValues,
  id,
}: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // ======== 1. useForm Typing (Critical Part) ===========
  const form = useForm<ContentSchema>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      ...getDefaultContentValues(),
      ...(initialValues ?? {}),
    },
  });
  // ======================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        handleClientError(err, "Failed to fetch categories.");
      }
    };
    fetchCategories();

    if (mode === "update" && initialValues) {
      form.reset({
        ...getDefaultContentValues(),
        ...initialValues,
        tags: (initialValues.tags ?? []).map((tag: TagInput) => ({
          id: tag.id,
          name: tag.name,
        })),
        categoryId: initialValues.categoryId ?? "",
      });
    }
  }, [mode, initialValues, form]);

  // ====== 2. Output type for onSubmit (matches validated data) ======
  const onSubmit: SubmitHandler<ContentSchema> = async (values) => {
    setLoading(true);

    try {
      if (mode === "update" && id) {
        await axios.put(`/api/contents/${id}`, values);
        toast.success("Content updated successfully.");
      } else {
        await axios.post(`/api/contents`, values);
        toast.success("Content submitted successfully.");
      }
      router.push("/panel/contents");
    } catch (err) {
      handleClientError(err, "Failed to submit content.");
    } finally {
      setLoading(false);
    }
  };

  const imageValue = form.watch("image");

  if (mode === "update" && !initialValues) return <Loader />;

  return (
    <div className="container mx-auto mt-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardDescription>
            {mode === "create"
              ? "Share your content with the community. Fill out the form below to submit your article, video, or other content."
              : "You can update your content here."}
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
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      disabled={categories.length === 0}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
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
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter content title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Link */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value.map((tag) => tag.name)}
                        onChange={(tags) =>
                          field.onChange(
                            Array.from(
                              new Set(
                                tags.map((name) => name.trim().toLowerCase()),
                              ),
                            ).map((name) => ({ name })),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of your content..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden image */}
              <input
                type="hidden"
                value={imageValue}
                {...form.register("image")}
              />

              <div className="mt-2 flex flex-col-reverse items-center gap-3 md:flex-row">
                <Link href="/panel/contents" passHref>
                  <Button variant="secondary" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="w-full md:col-span-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircleNotchIcon className="animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>{mode === "create" ? "Submit" : "Update"} Content</>
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
