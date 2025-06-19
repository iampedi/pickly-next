// src/types/tag.ts

export type Tag = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TagInput = { id?: string; name: string };
