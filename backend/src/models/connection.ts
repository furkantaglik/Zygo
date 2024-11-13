import mongoose, { Schema, Document } from "mongoose";

interface IConnection extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  requester: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}

const ConnectionSchema = new Schema<IConnection>(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Connection = mongoose.model<IConnection>(
  "Connection",
  ConnectionSchema
);
