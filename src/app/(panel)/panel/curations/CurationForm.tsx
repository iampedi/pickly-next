// src/app/panel/curations/CurationForm.tsx
"use client";
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
import { contentTypes } from "@/constants/content-categories";
import { useAuth } from "@/contexts/AuthContext";
import { handleClientError } from "@/lib/handleClientError";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CONTENT_TYPES = contentTypes.map((type) => type.value) as [
  string,
  ...string[],
];

// --- Validation Schema ---
const formSchema = z.object({
  type: z
    .string()
    .refine((val) => val && val !== "", {
      message: "Please select a content type.",
    })
    .refine((val) => CONTENT_TYPES.includes(val), {
      message: "Invalid content type.",
    }),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  comment: z
    .string()
    .max(500, { message: "Comment must not exceed 500 characters." })
    .optional(),
});

// --- Suggestion type
type Suggestion = {
  id: string;
  title: string;
  type: string;
};

type ContentCurationFormProps = {
  mode?: "create" | "update";
  initialValues?: Partial<z.infer<typeof formSchema>>;
  id?: string;
};

export default function ContentCurationForm({
  mode = "create",
  initialValues,
  id,
}: ContentCurationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [, setCheckedContentId] = useState<string | null>(null);
  const lastClickedTitle = useRef<string>("");
  const checkedTypeRef = useRef<string>("");
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      type: "",
      title: "",
      comment: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        type: initialValues.type ?? "",
        title: initialValues.title ?? "",
        comment: initialValues.comment ?? "",
      });
    }
  }, [initialValues, form]);

  // ---- Fetch suggestions on title/type change (create mode)
  useEffect(() => {
    if (mode === "update") return;
    const type = form.watch("type");
    const title = form.watch("title");

    if (type && title.length > 1) {
      const fetchSuggestions = async () => {
        try {
          const res = await axios.get("/api/curations", {
            params: { type, title },
          });
          setSuggestions(res.data);
        } catch {
          setSuggestions([]);
        }
      };
      fetchSuggestions();
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, form.watch("type"), form.watch("title")]);

  // --- Suggestion select: fill title, hide suggestions, check duplication
  const handleSuggestionClick = async (s: Suggestion) => {
    form.setValue("title", s.title);
    lastClickedTitle.current = s.title;
    checkedTypeRef.current = form.getValues("type");
    setSuggestions([]);
    setShowSuggestions(false);
    setCheckedContentId(s.id);

    // Check duplication
    if (user?.id && s.id) {
      try {
        const res = await axios.get("/api/curations", {
          params: { userId: user.id, contentId: s.id },
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setIsDuplicate(true);
          toast.warning(
            "You have already curated this content. Please choose another one.",
          );
        } else {
          setIsDuplicate(false);
        }
      } catch {
        setIsDuplicate(false);
      }
    }
  };

  useEffect(() => {
    if (mode === "update") return;
    const subscription = form.watch((values) => {
      if (
        lastClickedTitle.current &&
        (values.title !== lastClickedTitle.current ||
          values.type !== checkedTypeRef.current)
      ) {
        setIsDuplicate(false);
      }
      if (!values.title || !values.type) setIsDuplicate(false);
    });
    return () => subscription.unsubscribe();
  }, [form, mode]);

  // Submit Handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      if (mode === "update" && id) {
        await axios.put(`/api/curations/${id}`, { comment: values.comment });
        toast.success("Curation updated successfully.");
        router.push("/panel/curations");
        return;
      }

      // Duplication check
      if (user?.id && values.title && values.type) {
        const res = await axios.get("/api/curations", {
          params: {
            userId: user.id,
            type: values.type,
            title: values.title,
          },
        });

        let alreadyCurated = false;
        if (Array.isArray(res.data) && res.data.length > 0) {
          const content = res.data[0];
          const checkCuration = await axios.get("/api/curations", {
            params: {
              userId: user.id,
              contentId: content.id,
            },
          });
          alreadyCurated = checkCuration.data.length > 0;
        }

        if (alreadyCurated) {
          toast.warning(
            "You have already curated this content. You can edit your curation in the Curations section.",
          );
          setLoading(false);
          setIsDuplicate(true);
          return;
        }
      }

      await axios.post("/api/curations", { ...values, userId: user?.id });
      form.reset();
      lastClickedTitle.current = "";
      checkedTypeRef.current = "";
      setIsDuplicate(false);
      toast.success("Curation submitted successfully.");
      router.push("/panel/curations");
    } catch (err) {
      handleClientError(err, "Failed to submit curation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto mt-6 max-w-lg">
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
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mode === "update"}
                    >
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
                name="title"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        {...field}
                        disabled={mode === "update"}
                      />
                    </FormControl>
                    <FormMessage />
                    {/* نمایش پیشنهادات فقط در حالت create */}
                    {mode !== "update" &&
                      showSuggestions &&
                      suggestions.length > 0 && (
                        <div className="absolute top-16 right-0 left-0 z-10 max-h-56 overflow-y-auto rounded-b-lg border border-t-0 bg-white shadow-lg">
                          {suggestions.map((s) => (
                            <div
                              key={s.id}
                              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
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

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Your Note
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
              <div className="mt-2 flex flex-col-reverse items-center gap-3 md:flex-row">
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/panel/curations">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="w-full md:col-span-2"
                  disabled={loading || (mode === "create" && isDuplicate)}
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
