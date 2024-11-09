export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  role: "admin" | "user";
  private: boolean;
  createdAt: string;
  updatedAt: string;
  followers: string[];
  following: string[];
  posts: string[];
  stories: string[];
  comments: string[];
  likes: string[];
}
