import { IPost } from "./post";
import { IUser } from "./user";

export interface INotification {
  _id: string;
  user: IUser;
  sender: IUser;
  post: IPost;
  content: string;
  type: "like" | "comment";
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
