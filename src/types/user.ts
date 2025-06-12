import { Curation } from "./curations";

export type User = {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
  username: string;
  password: string;
  curations: Curation[];
  isCurator: boolean;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
