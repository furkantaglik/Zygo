import { IUser } from "./user";

export type IMessage = {
  _id: string;
  content: string;
  sender: IUser;
  receiver: IUser;
  createdAt: string;
  updatedAt: string;
};
