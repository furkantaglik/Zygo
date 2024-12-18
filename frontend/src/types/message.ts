import { IUser } from "./user";

export type IMessage = {
  _id: string;
  content: string;
  sender: IUser;
  isRead: boolean;
  receiver: IUser;
  createdAt: string;
  updatedAt: string;
};
