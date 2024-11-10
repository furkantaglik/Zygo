export type IConnection = {
  _id: string;
  requester: string;
  receiver: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "accepted" | "rejected";
};
