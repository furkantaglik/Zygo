import mongoose, { Schema, Document } from "mongoose";

export interface ISave extends Document {
  post: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  user: mongoose.Types.ObjectId;
}

const SaveSchema: Schema = new Schema(
  {
    post: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Save = mongoose.model<ISave>("Save", SaveSchema);
