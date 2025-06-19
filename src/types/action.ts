// src/types/actions.ts

export type ActionType = "BOOKMARK" | "INSPIRED" | "THANKS";

export type UserContentAction = {
  id: string;
  userId: string;
  contentId: string;
  type: ActionType;
  createdAt: string;
  updatedAt: string;
};
