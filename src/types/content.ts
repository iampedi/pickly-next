// src/types/content.ts
import { UserContentAction } from "./action";
import { Category } from "./category";
import { Curation } from "./curation";
import { Tag } from "./tag";

export type Content = {
  id: string;
  title: string;
  image: string;
  link: string;
  description: string;
  categoryId: string;
  category: Category;
  contentTags: Tag[];
  curations: Curation[];
  userContentActions: UserContentAction[];
  createdAt: string;
  updatedAt: string;
};
