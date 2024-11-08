import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  user: mongoose.Types.ObjectId;
}

const PostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
