export type IPost = {
  _id?: string;
  content: string;
  mediaUrl?: string;
  mediaType: "image" | "video";
  createdAt?: string;
  updatedAt?: string;
  user?: string;
};
