import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const LikeSchema: Schema = new Schema(
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
  },
  { timestamps: true }
);

export const Like = mongoose.model<ILike>("Like", LikeSchema);
