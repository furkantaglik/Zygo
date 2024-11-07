import mongoose, { Schema, Document } from "mongoose";

interface IFollowRequest extends Document {
  requester: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}

const ConnectionSchema = new Schema<IFollowRequest>({
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
});

export const Connection = mongoose.model<IFollowRequest>(
  "Connection",
  ConnectionSchema
);
