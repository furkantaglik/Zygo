export interface IPost {
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
  updatedAt: string;
  user: string;
}
