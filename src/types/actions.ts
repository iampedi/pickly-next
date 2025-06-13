import { Content } from "./contents";
import { User } from "./user";

export type Action = {
  id: string;
  userId: string;
  user: User;
  contentId: string;
  content: Content;
  type: ActionType;
  createdAt: string;
  updatedAt: string;
};

export enum ActionType {
  BOOKMARK = "bookmark",
  INSPIRED = "inspired",
  THANKS = "thanks",
}
