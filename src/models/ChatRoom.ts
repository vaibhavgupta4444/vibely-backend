import { Schema, model, Types } from "mongoose"
import { IChatRoom } from "../interfaces/chat-room";

const chatRoomSchema = new Schema<IChatRoom>(
  {
    name: { type: String },
    isGroup: { type: Boolean, default: false },
    users: [{ type: Types.ObjectId, ref: "User", required: true }],
    latestMessage: { type: Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const ChatRoom = model<IChatRoom>("ChatRoom", chatRoomSchema);

export default ChatRoom;