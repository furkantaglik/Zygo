import { IPost } from "./post";
import { IUser } from "./user";

export interface ISave {
  post: IPost;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
}
