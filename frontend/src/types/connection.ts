import { IUser } from "./user";

export type IConnection = {
  _id: string;
  requester: IUser;
  receiver: IUser;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "accepted" | "rejected";
};
