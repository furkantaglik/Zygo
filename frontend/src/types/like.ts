import { IPost } from "./post";

export type ILike = {
  _id: string;
  post: IPost;
  user: IPost;
  createdAt: string;
  updatedAt: string;
};
