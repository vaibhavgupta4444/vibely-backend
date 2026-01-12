import { AuthenticatedRequest } from "../../interfaces/auth-request";
import User from "../../models/User";
import { BadRequestError, HttpError, NotFoundError, UnauthorizedError, ValidationError } from "../../utils/https-error";
import { passwordSchema } from "../../validators/password-schema";
import bcrypt from "bcrypt"
import { Request, Response } from "express";
import crypto from "crypto"
import { sendResetPassLink } from "../../utils/send-mail";

// changing password when user loggedIn
export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    if(!userId){
        throw UnauthorizedError("Unauthorized Access");
    }

    const currentPassword: string = req.body.currentPassword; 
    const password: string = passwordSchema.parse(req.body.password);

    if(!password || !currentPassword){
        throw BadRequestError("Password required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findById(userId);

    if(!user){
        throw NotFoundError("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if(!isMatch){
        throw ValidationError("Current password is incorrect");
    }

    user.password = hashedPassword;
    await user.save();
    return res.json({
        success: true,
        message: "Password updated successfully"
    });
}


// Changing password when use not loggedIn and forgot password
export const generateResetToken = async (req: Request, res: Response) => {
    const email: string = req.body.email;

    if(!email){
        throw BadRequestError("Email required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw NotFoundError("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    user.resetToken = passwordResetToken;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendResetPassLink(email, resetToken);

    return res.json({
        success: true,
        message: "Forgot Password link send on your email"
    });
}

export const forgotPassword = async (req: Request, res: Response) => {
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
        resetToken: hashedToken,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new HttpError(400, "Session not exist or has expired, regenerate link");
    }

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
}