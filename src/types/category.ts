// src/types/categories.ts

import { IconProps } from "@phosphor-icons/react/dist/lib/types";

export type Category = {
  id: string;
  value: string;
  label: string;
  icon: IconProps;
  createdAt: Date;
  updatedAt: Date;
};
