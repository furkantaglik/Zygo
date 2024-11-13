import { IUser } from "./user";

export type IStory = {
  _id: string;
  content: string;
  mediaType: "image" | "video";
  expiresAt: Date;
  createdAt: string;
  updatedAt: string;
  user: IUser;
};
