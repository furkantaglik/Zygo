import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  role: "admin" | "user";
  private: boolean;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, required: false, default: null },
    avatar: { type: String, required: false, default: null },
    private: { type: Boolean, required: true, default: false },
    verified: { type: Boolean, required: true, default: false },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
