import mongoose, { Document } from "mongoose";
import { Base } from "./base-interface";

export interface IMessage extends Document, Base {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
}