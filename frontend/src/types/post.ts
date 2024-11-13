import { IComment } from "./comment";
import { ILike } from "./like";
import { IUser } from "./user";

export type IPost = {
  _id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
  updatedAt: string;
  user: IUser;
  comments?: IComment[];
  likes?: ILike[];
};
