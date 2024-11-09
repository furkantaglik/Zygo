export interface IStory extends Document {
  content: string;
  mediaType: "image" | "video";
  expiresAt: Date;
  createdAt: string;
  updatedAt: string;
  user: string;
}
