import { Document, Types } from "mongoose"
import { Base } from "./base-interface"

export interface IStatus extends Document, Base{
    user: Types.ObjectId
    online: boolean,
    lastSeen: Date,
    typingIn: Types.ObjectId,
};

