// src/lib/validations/content.ts
import { z } from "zod";

export const contentSchema = z.object({
  categoryId: z
    .string({ required_error: "Category is required" })
    .min(1, "Please select a category"),

  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),

  image: z.string(),

  link: z.union([
    z.string().url({ message: "Link must be a valid URL" }),
    z.literal(""),
  ]),
  description: z
    .string()
    .trim()
    .max(500, { message: "Description must not exceed 500 characters" }),

  contentTags: z.array(z.string()).optional(),

  tags: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
    }),
  ),
});

export const getDefaultContentValues = (): ContentSchema => ({
  title: "",
  categoryId: "",
  image: "/images/content-placeholder.webp",
  link: "",
  description: "",
  contentTags: [],
  tags: [],
});

export type ContentSchema = z.infer<typeof contentSchema>;
export type ContentSchemaInput = z.input<typeof contentSchema>;
export type ContentSchemaOutput = z.output<typeof contentSchema>;
