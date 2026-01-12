import { Document, Types } from "mongoose";
import { Base } from "./base-interface";

export interface IMessage extends Document, Base {
    sender: Types.ObjectId;
    content: string;
    chatRoom: Types.ObjectId;
    isRead: boolean;
}