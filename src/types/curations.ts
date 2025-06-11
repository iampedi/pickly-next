// src/types/curations.ts
import { Content } from "./contents";

export type Curation = {
  id: string;
  userId: string;
  contentId: string;
  content?: Content;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};
