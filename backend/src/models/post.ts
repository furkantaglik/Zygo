import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt?: Date;
  updatedAt?: Date;
  user: mongoose.Types.ObjectId;
  comments?: mongoose.Types.ObjectId[];
  likes?: mongoose.Types.ObjectId[];
}

const PostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    mediaUrl: { type: String, required: false, default: null },
    mediaType: { type: String, enum: ["image", "video"], required: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
      default: null,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
