import {Document, Types} from "mongoose";
import { Base } from "./base-interface";

export interface IChatRoom extends Document, Base{
    name: string;
    isGroup: boolean;
    users: Types.ObjectId[];
    latestMessage: Types.ObjectId;
}