export interface IConnection {
  requester: string;
  receiver: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "accepted" | "rejected";
}
