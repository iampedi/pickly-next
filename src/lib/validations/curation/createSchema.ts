// src/lib/validations/curation/createSchema.ts
import { z } from "zod";

export const curationCreateSchema = z.object({
  userId: z.string(),
  contentId: z.string(),
  comment: z.string().max(500).optional(),
});

export type CurationCreateSchema = z.infer<typeof curationCreateSchema>;
