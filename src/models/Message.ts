import { Types, Schema, model } from "mongoose";
import { IMessage } from "../interfaces/message-interface";

const messageSchema = new Schema<IMessage>({
    sender:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type: String,
        required: true
    },
    isRead:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Message = model<IMessage>("Message", messageSchema);
export default Message;