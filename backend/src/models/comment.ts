import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
