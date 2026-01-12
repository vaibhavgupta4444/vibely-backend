import { Document } from "mongoose"
import { Base } from "./base-interface"

export interface IUser extends Document, Base{
    firstName: string,
    lastName: string,
    email: string,
    password:string,
    isVerified: boolean,
    otp?: string,
    otpExpires?: Date,
    resetToken?: string,
    resetTokenExpiry?: Date
}