// src/lib/validations/curation/updateSchema.ts
import { z } from "zod";

export const curationUpdateSchema = z.object({
  comment: z.string().max(500).optional(),
});

export type CurationUpdateSchema = z.infer<typeof curationUpdateSchema>;
