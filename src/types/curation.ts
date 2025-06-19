// src/types/curations.ts
import { User } from "./user";
import { Content } from "./content";

export type Curation = {
  id: string;
  userId: string;
  contentId: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  content?: Content;
};
