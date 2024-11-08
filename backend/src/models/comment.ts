import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  createdAt: Date;
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
