// src/types/user.ts
import { ActionType } from "./action";
import { Curation } from "./curation";

export type Role = "USER" | "CURATOR" | "ADMIN";

export type User = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  avatar?: string;
  role: Role;
  curations: Curation[];
  userContentActions: ActionType[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};
