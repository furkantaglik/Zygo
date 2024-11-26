import { IUser } from "./user";

export type IConnection = {
  _id: string;
  requester: IUser;
  receiver: IUser;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "accepted" | "rejected" | "blocked";
};

export type IRequestDetails = {
  sentRequests: IConnection[];
  receivedRequests: IConnection[];
  acceptedRequests: IConnection[];
  rejectedRequests: IConnection[];
  acceptedBy: IConnection[];
  rejectedBy: IConnection[];
};
