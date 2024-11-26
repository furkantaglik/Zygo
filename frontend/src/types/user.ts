export type IUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  role: "admin" | "user";
  private: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  followers: string;
  following: string;
  posts: string;
  stories: string;
  comments: string;
  likes: string;
  sentRequests: string;
  receivedRequests: string;
  rejectedRequests: string;
  rejectedBy: string;
};