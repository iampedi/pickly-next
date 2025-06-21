// src/lib/validations/curation/formSchema.ts
import { z } from "zod";

export const curationFormSchema = z.object({
  categoryId: z.string().refine((val) => val && val !== "", {
    message: "Please select a category.",
  }),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  comment: z
    .string()
    .max(500, { message: "Comment must not exceed 500 characters." })
    .optional(),
  contentId: z.string().optional(),
});

export type CurationFormSchema = z.infer<typeof curationFormSchema>;

export const getDefaultCurationValues = (): CurationFormSchema => ({
  categoryId: "",
  title: "",
  comment: "",
  contentId: undefined,
});
