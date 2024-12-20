import { IUser } from "./user";

export type IComment = {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  user: IUser;
};
