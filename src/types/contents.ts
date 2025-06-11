// src/types/content.ts
import { Curation } from "./curations";

export type Content = {
  id: string;
  title: string;
  type: string;
  link: string;
  tags: string[];
  description?: string;
  curations: Curation[];
  createdAt: string;
  updatedAt: string;
};
