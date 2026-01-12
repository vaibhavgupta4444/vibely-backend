import mongoose from "mongoose";
import { IUser } from "../interfaces/user-interface"

const userSchema = new mongoose.Schema<IUser>({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please enter valid emailId"
        ]
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    otp:{
        type: String,
    },
    otpExpires:{
        type: Date,
    },
    resetToken:{
        type: String
    },
    resetTokenExpiry:{
        type: Date
    }
},
{
    timestamps: true
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;