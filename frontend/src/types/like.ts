import { IPost } from "./post";
import { IUser } from "./user";

export type ILike = {
  _id: string;
  post: IPost;
  user: IUser;
  createdAt: string;
  updatedAt: string;
};
