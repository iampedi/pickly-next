// src/app/panel/contents/ContentForm.tsx
"use client";
import { contentTypes } from "@/constants/conent-types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// UI Imports
import { Button } from "@/components/theme/Button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/theme/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";

const CONTENT_TYPES = contentTypes.map((type) => type.value) as [
  string,
  ...string[],
];

const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  type: z
    .string()
    .refine((val) => val && val !== "", {
      message: "Please select a content type.",
    })
    .refine((val) => CONTENT_TYPES.includes(val as string), {
      message: "Invalid content type.",
    }),
  link: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).optional(),
  description: z
    .string()
    .max(500, {
      message: "Description must not exceed 500 characters.",
    })
    .optional(),
});

type ContentFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<z.infer<typeof formSchema>>;
  id?: string;
};

export default function ContentForm({
  mode,
  initialValues,
  id,
}: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      type: "",
      description: "",
      link: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        title: initialValues.title ?? "",
        type: initialValues.type ?? "",
        description: initialValues.description ?? "",
        link: initialValues.link ?? "",
        tags: initialValues.tags ?? [],
      });
    }
  }, [initialValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (mode === "update" && id) {
        await axios.put(`/api/contents/${id}`, values);
        router.push("/panel/contents?updated=true");
      } else {
        await axios.post(`/api/contents`, values);
        router.push("/panel/contents?submitted=true");
      }
    } catch (error) {
      let errorMsg = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.error || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  if (mode === "update" && !initialValues) {
    return <Loader />;
  }

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

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button
                type="submit"
                className="mt-2 w-full md:col-span-2"
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
