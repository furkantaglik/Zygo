import mongoose, { Schema, Document } from "mongoose";

export interface IStory extends Document {
  content: string;
  mediaType: "image" | "video";
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  user: mongoose.Types.ObjectId;
}

const StorySchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    expiresAt: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Story = mongoose.model<IStory>("Story", StorySchema);
