import { IStatus } from "../interfaces/status";
import { Schema, model } from "mongoose";

const statusSchema = new Schema<IStatus>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date },
    typingIn: { type: Schema.Types.ObjectId, ref: "ChatRoom" },
  },
  { timestamps: true }
);

const Status = model<IStatus>("Status", statusSchema);
export default Status;